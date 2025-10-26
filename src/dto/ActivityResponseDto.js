class ActivityResponseDto {
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
}

module.exports = ActivityResponseDto;