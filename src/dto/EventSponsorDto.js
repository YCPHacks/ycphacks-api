class EventSponsorDto{
    constructor(
        event_id,
        sponsor_id,
        sponsor_tier,
        sponsor_amount
    ){
        this.event_id = event_id;
        this.sponsor_id = sponsor_id;
        this.sponsor_tier_id = sponsor_tier;
        this.amount = sponsor_amount;
    }
}