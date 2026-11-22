// setTimeout fires right away if it's over ~24.8 days so we wait in chunks
const MAX_DELAY_MS = 2 ** 31 - 1;

// double checks the time first since docker's clock can jump back
const runAt = (date, fn) => {
    let timer;
    const check = () => (Date.now() >= date.getTime() ? fn() : wait());
    const wait = () => {
        const ms = Math.max(date.getTime() - Date.now(), 0);
        timer = setTimeout(check, Math.min(ms, MAX_DELAY_MS));
    };
    wait();

    return { cancel: () => clearTimeout(timer) };
};

module.exports = { runAt };
