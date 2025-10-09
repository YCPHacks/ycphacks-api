class EventParticipant {
    constructor(
        eventId,
        userId,
        teamId
    ) {
        this.eventId = eventId;
        this.userId = userId;
        this.teamId = teamId;
    }
}

module.exports = EventParticipant