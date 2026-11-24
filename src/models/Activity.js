class Activity {
    constructor(
        id,
        activityName,
        activityDate,
        activityDescription,
        eventId,
        notifyDiscord = true
    ) {
        this.id = id;
        this.activityName = activityName;
        this.activityDate = activityDate;
        this.activityDescription = activityDescription;
        this.eventId = eventId;
        this.notifyDiscord = notifyDiscord;
    }

    validate(isCreate = true) {
        const errors = {};
        const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/; // Checks for 'YYYY-MM-DDTHH:mm:ss.sssZ' format

        // 1. Validate id
        if (!isCreate && (!this.id || this.id < 0)) {
            errors.id = "ID is required for updating";
        }

        // 2. Validate name presence and length
        if (!this.activityName) {
            errors.activityName = "Name is required";
        } else if (this.activityName.length > 255) {
            errors.activityName = "Name must be less than 256 characters";
        }

        // 3. Validate date presence, date is in valid format, and date is not in the past
        if (!this.activityDate) {
            errors.activityDate = "Date is required";
        } else if (!dateRegex.test(this.activityDate)) {
            errors.activityDate = "Invalid date format";
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

        // 6. Validate Discord toggle
        if (typeof this.notifyDiscord !== 'boolean') {
            errors.notifyDiscord = 'Notify Discord must be true or false';
        }

        return errors;
    }
}

module.exports = Activity
