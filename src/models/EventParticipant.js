class EventParticipant {
    constructor(
        eventId,
        userId,
        teamId,
        id
    ) {
        this.eventId = eventId;
        this.userId = userId;
        this.teamId = teamId;
        this.id = id;
    }
}

module.exports = EventParticipant