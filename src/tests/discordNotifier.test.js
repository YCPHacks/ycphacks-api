const { runAt } = require('../util/runAt');
const EventRepo = require('../repository/event/EventRepo');
const notifier = require('../util/discordNotifier');

jest.mock('../repository/event/EventRepo');
jest.mock('../util/runAt');

const HOUR = 60 * 60 * 1000;
const LEAD = 15 * 60 * 1000;
const flush = () => new Promise((resolve) => setImmediate(resolve));

const makeActivity = (overrides = {}) => ({
    id: 7,
    activityName: 'Opening Ceremony',
    activityDescription: 'Main stage',
    activityDate: new Date(Date.now() + 2 * HOUR),
    eventId: 1,
    notifyDiscord: true,
    discordNotifiedAt: null,
    ...overrides
});

describe('discordNotifier', () => {
    const originalEnv = process.env;
    let createdJobs;

    beforeEach(async () => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
        process.env = { ...originalEnv, DISCORD_WEBHOOK_URL: 'https://discord.test/webhook' };
        delete process.env.DISCORD_LEAD_MINUTES;
        global.fetch = jest.fn().mockResolvedValue({ ok: true, status: 204 });
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});

        createdJobs = [];
        runAt.mockImplementation((date, fn) => {
            const job = { date, fn, cancel: jest.fn() };
            createdJobs.push(job);
            return job;
        });

        EventRepo.findActiveEvent.mockResolvedValue({ id: 1 });
        EventRepo.getUpcomingActivitiesToNotify.mockResolvedValue([]);
        await notifier.startDiscordNotifier();
        jest.clearAllMocks();
        createdJobs = [];
    });

    afterEach(() => {
        notifier.stopDiscordNotifier();
    });

    afterAll(() => {
        process.env = originalEnv;
        delete global.fetch;
    });

    describe('buildActivityMessage', () => {
        it('builds an @everyone message with timestamps and description', () => {
            const activity = makeActivity({ activityDate: new Date('2030-01-01T19:00:00Z') });
            const unix = Math.floor(activity.activityDate.getTime() / 1000);

            const msg = notifier.buildActivityMessage(activity);

            expect(msg.content).toBe(`@everyone **Opening Ceremony** starts <t:${unix}:R> (<t:${unix}:t>)`);
            expect(msg.allowed_mentions).toEqual({ parse: ['everyone'] });
            expect(msg.embeds).toEqual([{ title: 'Opening Ceremony', description: 'Main stage' }]);
        });

        it('leaves the embed description out when it is empty', () => {
            const msg = notifier.buildActivityMessage(makeActivity({ activityDescription: '' }));

            expect(msg.embeds[0]).not.toHaveProperty('description');
        });
    });

    describe('startDiscordNotifier', () => {
        it('stays disabled without a webhook URL', async () => {
            notifier.stopDiscordNotifier();
            delete process.env.DISCORD_WEBHOOK_URL;

            expect(await notifier.startDiscordNotifier()).toBe(false);
            await notifier.scheduleActivity(makeActivity());

            expect(runAt).not.toHaveBeenCalled();
        });

        it('schedules every upcoming activity in the active event', async () => {
            notifier.stopDiscordNotifier();
            EventRepo.getUpcomingActivitiesToNotify.mockResolvedValue([makeActivity(), makeActivity({ id: 8 })]);

            expect(await notifier.startDiscordNotifier()).toBe(true);

            expect(EventRepo.getUpcomingActivitiesToNotify).toHaveBeenCalledWith(1, expect.any(Date));
            expect(runAt).toHaveBeenCalledTimes(2);
            expect([...notifier.getScheduledJobs().keys()]).toEqual([7, 8]);
        });
    });

    describe('scheduleActivity', () => {
        it('schedules the alert DISCORD_LEAD_MINUTES before the start', async () => {
            const activity = makeActivity();

            await notifier.scheduleActivity(activity, 1);

            expect(runAt).toHaveBeenCalledWith(new Date(activity.activityDate.getTime() - LEAD), expect.any(Function));
        });

        it('honors a custom DISCORD_LEAD_MINUTES', async () => {
            process.env.DISCORD_LEAD_MINUTES = '30';
            const activity = makeActivity();

            await notifier.scheduleActivity(activity, 1);

            expect(createdJobs[0].date).toEqual(new Date(activity.activityDate.getTime() - 30 * 60 * 1000));
        });

        it('replaces the existing job when rescheduled', async () => {
            await notifier.scheduleActivity(makeActivity(), 1);
            await notifier.scheduleActivity(makeActivity({ activityDate: new Date(Date.now() + 3 * HOUR) }), 1);

            expect(createdJobs[0].cancel).toHaveBeenCalled();
            expect(notifier.getScheduledJobs().get(7)).toBe(createdJobs[1]);
        });

        it('cancels and does not reschedule when the switch is off', async () => {
            await notifier.scheduleActivity(makeActivity(), 1);
            await notifier.scheduleActivity(makeActivity({ notifyDiscord: false }), 1);

            expect(createdJobs[0].cancel).toHaveBeenCalled();
            expect(createdJobs).toHaveLength(1);
            expect(notifier.getScheduledJobs().has(7)).toBe(false);
        });

        it('skips activities that are not in the active event', async () => {
            await notifier.scheduleActivity(makeActivity({ eventId: 2 }));

            expect(EventRepo.findActiveEvent).toHaveBeenCalled();
            expect(runAt).not.toHaveBeenCalled();
        });

        it('skips activities that were already announced or already started', async () => {
            await notifier.scheduleActivity(makeActivity({ discordNotifiedAt: new Date() }), 1);
            await notifier.scheduleActivity(makeActivity({ activityDate: new Date(Date.now() - HOUR) }), 1);

            expect(runAt).not.toHaveBeenCalled();
        });

        it('sends right away when the activity is already inside the lead window', async () => {
            const activity = makeActivity({ activityDate: new Date(Date.now() + 5 * 60 * 1000) });
            EventRepo.findActivityById.mockResolvedValue(activity);

            await notifier.scheduleActivity(activity, 1);
            await flush();

            expect(runAt).not.toHaveBeenCalled();
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(EventRepo.markActivityNotified).toHaveBeenCalledWith(7, activity.activityDate);
        });
    });

    describe('cancelActivity / scheduleAll', () => {
        it('cancelActivity cancels the job', async () => {
            await notifier.scheduleActivity(makeActivity(), 1);

            notifier.cancelActivity('7');

            expect(createdJobs[0].cancel).toHaveBeenCalled();
            expect(notifier.getScheduledJobs().size).toBe(0);
        });

        it('scheduleAll drops old jobs before rescheduling', async () => {
            await notifier.scheduleActivity(makeActivity({ id: 99 }), 1);
            EventRepo.getUpcomingActivitiesToNotify.mockResolvedValue([makeActivity()]);

            await notifier.scheduleAll();

            expect(createdJobs[0].cancel).toHaveBeenCalled();
            expect([...notifier.getScheduledJobs().keys()]).toEqual([7]);
        });

        it('scheduleAll schedules nothing without an active event', async () => {
            EventRepo.findActiveEvent.mockResolvedValue(null);

            await notifier.scheduleAll();

            expect(EventRepo.getUpcomingActivitiesToNotify).not.toHaveBeenCalled();
            expect(runAt).not.toHaveBeenCalled();
        });
    });

    describe('announceActivity (when a job fires)', () => {
        const dueActivity = () => makeActivity({ activityDate: new Date(Date.now() + 10 * 60 * 1000) });

        it('sends the alert and marks the activity notified', async () => {
            const activity = dueActivity();
            EventRepo.findActivityById.mockResolvedValue(activity);

            await notifier.announceActivity(7);

            expect(global.fetch).toHaveBeenCalledWith('https://discord.test/webhook', expect.objectContaining({ method: 'POST' }));
            expect(EventRepo.markActivityNotified).toHaveBeenCalledWith(7, activity.activityDate);
        });

        it('does not send when the activity was deleted or switched off since scheduling', async () => {
            EventRepo.findActivityById.mockResolvedValueOnce(null);
            await notifier.announceActivity(7);

            EventRepo.findActivityById.mockResolvedValueOnce({ ...dueActivity(), notifyDiscord: false });
            await notifier.announceActivity(7);

            expect(global.fetch).not.toHaveBeenCalled();
        });

        it('reschedules instead of sending when the start time moved later', async () => {
            EventRepo.findActivityById.mockResolvedValue(makeActivity({ activityDate: new Date(Date.now() + 3 * HOUR) }));

            await notifier.announceActivity(7);

            expect(global.fetch).not.toHaveBeenCalled();
            expect(runAt).toHaveBeenCalledTimes(1);
        });

        it('does not mark the activity and retries when Discord rejects the post', async () => {
            EventRepo.findActivityById.mockResolvedValue(dueActivity());
            global.fetch.mockResolvedValue({ ok: false, status: 429 });

            await notifier.announceActivity(7);

            expect(EventRepo.markActivityNotified).not.toHaveBeenCalled();
            expect(runAt).toHaveBeenCalledTimes(1);
            expect(notifier.getScheduledJobs().has(7)).toBe(true);
        });

        it('does not mark the activity when the request throws', async () => {
            EventRepo.findActivityById.mockResolvedValue(dueActivity());
            global.fetch.mockRejectedValue(new Error('network down'));

            await notifier.announceActivity(7);

            expect(EventRepo.markActivityNotified).not.toHaveBeenCalled();
        });

        it('gives up on a request that hangs', async () => {
            EventRepo.findActivityById.mockResolvedValue(dueActivity());

            await notifier.announceActivity(7);

            expect(global.fetch.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
        });
    });

    describe('overlapping saves and sends', () => {
        let row;
        let finishSend;

        beforeEach(() => {
            row = makeActivity({ activityDate: new Date(Date.now() + 10 * 60 * 1000) });
            EventRepo.findActivityById.mockImplementation(async () => ({ ...row }));
            EventRepo.markActivityNotified.mockImplementation(async (id, date) => {
                if (date?.getTime() !== row.activityDate.getTime()) return [0];
                row.discordNotifiedAt = new Date();
                return [1];
            });
            global.fetch.mockImplementationOnce(() => new Promise((resolve) => {
                finishSend = (ok = true) => resolve({ ok, status: ok ? 204 : 500 });
            }));
        });

        it('posts once when saved again during a send', async () => {
            const first = notifier.announceActivity(7);
            await flush();
            await notifier.scheduleActivity({ ...row }, 1);
            await flush();

            finishSend();
            await first;
            await flush();

            expect(global.fetch).toHaveBeenCalledTimes(1);
        });

        it('still sends to other activities during a send', async () => {
            const first = notifier.announceActivity(7);
            await flush();

            EventRepo.findActivityById.mockResolvedValueOnce({ ...row, id: 8 });
            await notifier.announceActivity(8);

            expect(global.fetch).toHaveBeenCalledTimes(2);
            finishSend();
            await first;
        });

        it('does not mark a new time as sent when it changed during a send', async () => {
            const first = notifier.announceActivity(7);
            await flush();

            row.activityDate = new Date(Date.now() + 3 * HOUR);
            await notifier.scheduleActivity({ ...row }, 1);
            finishSend();
            await first;

            expect(row.discordNotifiedAt).toBeNull();
            expect(notifier.getScheduledJobs().get(7).date).toEqual(new Date(row.activityDate.getTime() - LEAD));
        });

        it('keeps the newer job when the send for the old time fails', async () => {
            const first = notifier.announceActivity(7);
            await flush();

            row.activityDate = new Date(Date.now() + 3 * HOUR);
            await notifier.scheduleActivity({ ...row }, 1);
            finishSend(false);
            await first;

            expect(createdJobs).toHaveLength(1);
            expect(notifier.getScheduledJobs().get(7)).toBe(createdJobs[0]);
        });

        it('makes an edit wait for the send in flight', async () => {
            const first = notifier.announceActivity(7);
            await flush();

            let markedWhenEdited;
            const edit = notifier.withActivityLock('7', async () => {
                markedWhenEdited = !!row.discordNotifiedAt;
            });
            await flush();
            expect(markedWhenEdited).toBeUndefined();

            finishSend();
            await Promise.all([first, edit]);
            expect(markedWhenEdited).toBe(true);
        });
    });

    describe('withActivityLock', () => {
        it('releases the lock when the task throws', async () => {
            await expect(notifier.withActivityLock(7, async () => { throw new Error('edit failed'); })).rejects.toThrow('edit failed');
            await expect(notifier.withActivityLock(7, async () => 'next')).resolves.toBe('next');
        });
    });

    describe('database errors', () => {
        const due = () => makeActivity({ activityDate: new Date(Date.now() + 10 * 60 * 1000) });

        it('retries when the activity cannot be read', async () => {
            EventRepo.findActivityById.mockRejectedValueOnce(new Error('db down')).mockResolvedValue(due());

            await notifier.announceActivity(7);
            expect(createdJobs).toHaveLength(1);

            await createdJobs[0].fn();
            expect(global.fetch).toHaveBeenCalledTimes(1);
        });

        it('retries when the active event cannot be read', async () => {
            EventRepo.findActivityById.mockResolvedValue(due());
            EventRepo.findActiveEvent.mockRejectedValueOnce(new Error('db down'));

            await notifier.announceActivity(7);

            expect(createdJobs).toHaveLength(1);
        });

        it('retries only the mark, not the post, when marking fails', async () => {
            EventRepo.findActivityById.mockResolvedValue(due());
            EventRepo.markActivityNotified.mockRejectedValueOnce(new Error('db down')).mockResolvedValue([1]);

            await notifier.announceActivity(7);
            expect(createdJobs).toHaveLength(1);
            await createdJobs[0].fn();

            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(EventRepo.markActivityNotified).toHaveBeenCalledTimes(2);
        });

        it('retries when a saved activity cannot be scheduled', async () => {
            EventRepo.findActiveEvent.mockRejectedValueOnce(new Error('db down'));

            await notifier.scheduleActivity(makeActivity());

            expect(createdJobs).toHaveLength(1);
            expect(notifier.getScheduledJobs().has(7)).toBe(true);
        });

        it.each(['findActiveEvent', 'getUpcomingActivitiesToNotify'])('retries startup when %s fails', async (method) => {
            notifier.stopDiscordNotifier();
            EventRepo[method].mockRejectedValueOnce(new Error('db down'));

            await notifier.startDiscordNotifier();
            expect(createdJobs).toHaveLength(1);

            EventRepo.getUpcomingActivitiesToNotify.mockResolvedValue([makeActivity()]);
            await createdJobs[0].fn();
            expect([...notifier.getScheduledJobs().keys()]).toEqual([7]);
        });

        it('cancels the startup retry on stop', async () => {
            EventRepo.findActiveEvent.mockRejectedValueOnce(new Error('db down'));
            await notifier.scheduleAll();

            notifier.stopDiscordNotifier();

            expect(createdJobs[0].cancel).toHaveBeenCalled();
        });
    });
});
