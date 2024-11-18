class Event {
    constructor(
        id,
        eventName,
        startDate,
        endDate,
        canChange,
        participants,
        schedule,
        sponsors,
        prizes
    ) {
        this.id = id
        this.eventName = eventName
        this.startDate = startDate
        this.endDate = endDate
        this.canChange = canChange
        this.participants = participants
        this.schedule = schedule
        this.sponsors = sponsors
        this.prizes = prizes
    }
}

module.exports = Event