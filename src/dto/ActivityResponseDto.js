class ActivityResponseDto {
    constructor(
        id,
        activityName,
        activityDate,
        activityDescription,
        eventId,
        notifyDiscord
    ) {
        this.id = id;
        this.activityName = activityName;
        this.activityDate = activityDate;
        this.activityDescription = activityDescription;
        this.eventId = eventId;
        this.notifyDiscord = notifyDiscord;
    }
}

module.exports = ActivityResponseDto;
