// pings discord before each activity starts, just a webhook so no bot needed
// timers are only in memory so we remake them from the db on startup
const { runAt } = require('./runAt');
const EventRepo = require('../repository/event/EventRepo');

const DEFAULT_LEAD_MINUTES = 15;
const RETRY_DELAY_MS = 60 * 1000;
// edits wait on sends so give up after 10s
const SEND_TIMEOUT_MS = 10 * 1000;

const jobs = new Map();
const locks = new Map();
// posted but didn't save to the db, so don't post these again
const sentButUnmarked = new Map();
let scheduleAllRetry = null;
// stays off if there's no webhook url
let enabled = false;

const getWebhookUrl = () => process.env.DISCORD_WEBHOOK_URL;
const getLeadMinutes = () => {
    const minutes = parseInt(process.env.DISCORD_LEAD_MINUTES, 10);
    return Number.isFinite(minutes) && minutes > 0 ? minutes : DEFAULT_LEAD_MINUTES;
};

const getAlertTime = (activity) =>
    new Date(new Date(activity.activityDate).getTime() - getLeadMinutes() * 60 * 1000);

const getRetryTime = () => new Date(Date.now() + RETRY_DELAY_MS);

const isAnnounceable = (activity, activeEventId, now = new Date()) =>
    !!activity &&
    activity.eventId === activeEventId &&
    activity.notifyDiscord !== false &&
    !activity.discordNotifiedAt &&
    new Date(activity.activityDate) > now;

const buildActivityMessage = (activity) => {
    const unix = Math.floor(new Date(activity.activityDate).getTime() / 1000);

    const embed = { title: activity.activityName };
    if (activity.activityDescription) embed.description = activity.activityDescription;

    return {
        // <t:...> shows up in each person's own timezone
        content: `@everyone **${activity.activityName}** starts <t:${unix}:R> (<t:${unix}:t>)`,
        embeds: [embed],
        // only @everyone can ping, not stuff typed in the name or description
        allowed_mentions: { parse: ['everyone'] }
    };
};

const sendActivityAlert = async (activity) => {
    try {
        const res = await fetch(getWebhookUrl(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(buildActivityMessage(activity)),
            signal: AbortSignal.timeout(SEND_TIMEOUT_MS)
        });
        if (!res.ok) {
            console.error(`Discord alert for activity ${activity.id} failed: ${res.status}`);
            return false;
        }
        return true;
    } catch (err) {
        console.error(`Discord alert for activity ${activity.id} failed:`, err.message || err);
        return false;
    }
};

// one thing at a time per activity so we don't double post
const withActivityLock = async (activityId, task) => {
    const id = Number(activityId);
    const result = (locks.get(id) ?? Promise.resolve()).then(task);
    const settled = result.catch(() => {}); // don't let one failure hold up the rest
    locks.set(id, settled);

    try {
        return await result;
    } finally {
        if (locks.get(id) === settled) locks.delete(id);
    }
};

const cancelActivity = (activityId) => {
    const job = jobs.get(Number(activityId));
    if (job) job.cancel();
    jobs.delete(Number(activityId));
};

const cancelAll = () => {
    for (const job of jobs.values()) job.cancel();
    jobs.clear();
    if (scheduleAllRetry) scheduleAllRetry.cancel();
    scheduleAllRetry = null;
};

const scheduleRetry = (activityId) => {
    const id = Number(activityId);
    // don't replace a newer timer with a retry
    if (!enabled || jobs.has(id)) return;
    jobs.set(id, runAt(getRetryTime(), () => announceActivity(id)));
};

// don't call this directly, use announceActivity
const announce = async (id) => {
    cancelActivity(id);
    if (!enabled) return;

    try {
        // grab it again in case it got changed or deleted
        const [activity, event] = await Promise.all([
            EventRepo.findActivityById(id),
            EventRepo.findActiveEvent()
        ]);
        if (!event || !isAnnounceable(activity, event.id)) return;

        // time got pushed back so wait
        if (getAlertTime(activity) > new Date()) {
            await scheduleActivity(activity, event.id);
            return;
        }

        const startTime = new Date(activity.activityDate).getTime();
        if (sentButUnmarked.get(id) !== startTime) {
            if (!(await sendActivityAlert(activity))) {
                // didn't send, try again every minute until it starts
                if (new Date(activity.activityDate) > getRetryTime()) scheduleRetry(id);
                return;
            }
            sentButUnmarked.set(id, startTime);
        }

        await EventRepo.markActivityNotified(id, activity.activityDate);
        sentButUnmarked.delete(id);
    } catch (err) {
        console.error(`Discord alert for activity ${id} failed:`, err.message || err);
        scheduleRetry(id);
    }
};

const announceActivity = (activityId) =>
    withActivityLock(activityId, () => announce(Number(activityId)));

const scheduleActivity = async (activity, activeEventId) => {
    if (!activity) return;
    cancelActivity(activity.id);
    if (!enabled) return;

    try {
        if (activeEventId === undefined) {
            const event = await EventRepo.findActiveEvent();
            activeEventId = event ? event.id : null;
        }
        if (!isAnnounceable(activity, activeEventId)) return;

        const alertTime = getAlertTime(activity);
        if (alertTime <= new Date()) {
            // too close to wait so send it now, no await so saving isn't stuck on discord
            announceActivity(activity.id);
            return;
        }
        cancelActivity(activity.id); // in case another call made one while we waited
        jobs.set(activity.id, runAt(alertTime, () => announceActivity(activity.id)));
    } catch (err) {
        console.error(`Scheduling Discord alert for activity ${activity.id} failed:`, err.message || err);
        scheduleRetry(activity.id);
    }
};

const scheduleAll = async () => {
    cancelAll();
    if (!enabled) return;

    try {
        const event = await EventRepo.findActiveEvent();
        if (!event) return;

        const activities = await EventRepo.getUpcomingActivitiesToNotify(event.id, new Date());
        for (const activity of activities) {
            await scheduleActivity(activity, event.id);
        }
        console.log(`Discord notifier: ${jobs.size} activity alert(s) scheduled`);
    } catch (err) {
        console.error('Scheduling Discord alerts failed, retrying in 60s:', err.message || err);
        if (!enabled) return;
        if (scheduleAllRetry) scheduleAllRetry.cancel();
        scheduleAllRetry = runAt(getRetryTime(), () => scheduleAll());
    }
};

const startDiscordNotifier = async () => {
    if (!getWebhookUrl()) {
        enabled = false;
        console.log('Discord notifier disabled (DISCORD_WEBHOOK_URL not set)');
        return false;
    }
    enabled = true;
    console.log(`Discord notifier started (${getLeadMinutes()} min lead time)`);
    await scheduleAll();
    return true;
};

const stopDiscordNotifier = () => {
    enabled = false;
    cancelAll();
    sentButUnmarked.clear();
};

module.exports = {
    buildActivityMessage,
    sendActivityAlert,
    withActivityLock,
    announceActivity,
    scheduleActivity,
    cancelActivity,
    scheduleAll,
    startDiscordNotifier,
    stopDiscordNotifier,
    getScheduledJobs: () => jobs
};
