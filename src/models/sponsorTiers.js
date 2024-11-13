class sponsorTiers{
    constructor(
        tier,
        lower_threshold
    ){
        this.tier = tier;
        this.lower_threshold = lower_threshold;
    }
    validate() {
        const errors = [];

        if (!this.tier) {
            errors.push("Missing Tier Name");
        }

        if(!this.lower_threshold) {
            errors.push("Missing Tier Threshold");
        }

        return errors;
    }
}