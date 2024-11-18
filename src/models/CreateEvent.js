class CreateEvent {
    constructor(
        eventName,
        startDate,
        endDate,
        canChange
    ) {
        this.eventName = eventName
        this.startDate = startDate
        this.endDate = endDate
        this.canChange = canChange
    }

    // start date must be in the future
    // end date must be after start date
    validate() {
        const errors = [];
        const now = new Date();

        const startDate = new Date(this.startDate);
        const endDate = new Date(this.endDate);

        if (isNaN(startDate.getTime())) {
            errors.push('Start date is invalid.');
        } else if (startDate <= now) {
            errors.push('Start date must be in the future.');
        }

        if (isNaN(endDate.getTime())) {
            errors.push('End date is invalid.');
        } else if (endDate <= startDate) {
            errors.push('End date must be after the start date.');
        }

        return errors;
    }
}

module.exports = CreateEvent