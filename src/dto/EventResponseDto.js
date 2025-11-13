class EventResponseDto {
    constructor(
        id,
        eventName,
        startDate,
        endDate,
        canChange,
        year,
        isActive
    ) {
        this.id = id;
        this.eventName = eventName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.canChange = canChange;
        this.year = year;
        this.isActive = isActive
    }
}

module.exports = EventResponseDto;