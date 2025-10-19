// When a date and time comes from the frontend, it will be in the standard 12-hour format (i.e., YYYY-MM-DD hh:mm:ss AM/PM).
// To properly validate and store this datetime in the DB, we convert it to 24-hour format.
// When we pull the datetime from the DB, it is in ISO 8601 format (i.e., YYYY-MM-DDTHH:mm:ss.SSSZ), which we convert
// back to 12-hour format before sending it to the frontend.

const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

module.exports = {
    // Convert from YYYY-MM-DD hh:mm:ss AM/PM (frontend) to YYYY-MM-DD HH:mm:ss (backend)
    to24HourFormat: (dateStr) =>
        dayjs(dateStr, "YYYY-MM-DD hh:mm:ss A").format("YYYY-MM-DD HH:mm:ss"),

    // Convert from ISO or 24-hour (DB) to YYYY-MM-DD hh:mm:ss AM/PM (frontend)
    to12HourFormat: (dateStr) =>
        dayjs(dateStr).format("YYYY-MM-DD hh:mm:ss A"),
};