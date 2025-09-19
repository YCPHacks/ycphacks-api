class Prize {
    constructor(
        id,
        eventId,
        prizeName,
        categoryId,
        placement
    ) {
        this.id = id;
        this.eventId = eventId;
        this.prizeName = prizeName;
        this.categoryId = categoryId;
        this.placement = placement;
    }
}

module.exports = Prize