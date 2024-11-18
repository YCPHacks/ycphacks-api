class CreateEventDto {
    constructor(
        eventName,
        startDate,
        endDate,
    ) {
        this.eventName = eventName
        this.startDate = startDate
        this.endDate = endDate
    }
}

module.exports = CreateEventDto