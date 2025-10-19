class Activity {
    constructor(
        id,
        activityName,
        activityDate,
        activityDescription,
        eventId
    ) {
        this.id = id;
        this.activityName = activityName;
        this.activityDate = activityDate;
        this.activityDescription = activityDescription;
        this.eventId = eventId;
    }

    validate(isCreate = true) {
        const errors = {};
        const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/; // Checks for 'YYYY-MM-DD hh:mm:ss' format

        // 1. Validate id
        if (!isCreate && (!this.id || this.id < 0)) {
            errors.id = "ID is required for updating";
        }

        // 2. Validate name presence and length
        if (!this.activityName || this.activityName.length > 255) {
            errors.activityName = "Name is required and must be less than 256 characters";
        }

        // 3. Validate date presence, date is in valid format, and date is not in the past
        if (!this.activityDate) {
            errors.activityDate = "Date is required";
        } else if (!dateRegex.test(this.activityDate)) {
            errors.activityDate = "Invalid date format (expecting: YYYY-MM-DD hh:mm:ss AM/PM)";
        } else if (Date.parse(this.activityDate) <= new Date()) {
            errors.activityDate = "Date cannot be in the past"
        }

        // 4. Validate description length
        if (this.activityDescription.length > 255) {
            errors.activityDescription = 'Description must be less than 256 characters';
        }

        // 5. Validate event ID presence
        if (!this.eventId || this.eventId < 0) {
            errors.eventId = 'Event ID is required';
        }

        return errors;
    }
}

module.exports = Activity