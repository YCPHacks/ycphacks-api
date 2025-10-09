class EventSponsor{
    constructor(
        event_id,
        sponsor_id,
        sponsor_tier,
        sponsor_amount
    ){
        this.event_id = event_id;
        this.sponsor_id = sponsor_id;
        this.sponsor_tier = sponsor_tier;
        this.sponsor_amount = sponsor_amount;
    }
    validate() {
        const errors = [];

        if(!this.event_id) {
            errors.push("Sponsorship not associated with an event");
        }

        if(!this.sponsor_id) {
            errors.push("Missing Sponsor ID");
        }

        if (!this.sponsor_tier) {
            errors.push("Missing Sponsor Tier");
        }

        if(!this.sponsor_amount) {
            errors.push("Missing Sponsor Amount");
        }

        return errors;
    }
}

module.exports = EventSponsor;