const { runAt } = require('../util/runAt');

const DAY = 24 * 60 * 60 * 1000;

describe('runAt', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it.each([1 / 1440, 24, 25, 60, 400])('runs once, exactly on time, %s days out', (days) => {
        const fn = jest.fn();
        const ms = Math.round(days * DAY);
        runAt(new Date(Date.now() + ms), fn);

        jest.advanceTimersByTime(ms - 1);
        expect(fn).not.toHaveBeenCalled();

        jest.advanceTimersByTime(1);
        expect(fn).toHaveBeenCalledTimes(1);

        jest.runOnlyPendingTimers();
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('can be cancelled partway through a long wait', () => {
        const fn = jest.fn();
        const job = runAt(new Date(Date.now() + 60 * DAY), fn);

        jest.advanceTimersByTime(30 * DAY);
        job.cancel();
        jest.advanceTimersByTime(60 * DAY);

        expect(fn).not.toHaveBeenCalled();
    });

    it('waits again if the clock is set back during the wait', () => {
        const fn = jest.fn();
        const job = runAt(new Date(Date.now() + 60000), fn);

        jest.advanceTimersByTime(30000);
        jest.setSystemTime(Date.now() - 3000);
        jest.advanceTimersByTime(30000);
        expect(fn).not.toHaveBeenCalled();

        jest.advanceTimersByTime(3000);
        expect(fn).toHaveBeenCalledTimes(1);
        job.cancel();
    });

    it('runs right away for a time that has passed', () => {
        const fn = jest.fn();
        runAt(new Date(Date.now() - 1000), fn);

        jest.advanceTimersByTime(0);
        expect(fn).toHaveBeenCalledTimes(1);
    });
});
