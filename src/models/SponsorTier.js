class SponsorTier {
    constructor(
        id,
        tier,
        lowerThreshold
    ) {
        this.id = id;
        this.tier = tier;
        this.lowerThreshold = lowerThreshold;
    }

    validate() {
        const errors = [];

        if (!this.tier) {
            errors.push("Missing Tier Name");
        }

        if(!this.lowerThreshold) {
            errors.push("Missing Tier Threshold");
        }

        return errors;
    }
}

module.exports = SponsorTier