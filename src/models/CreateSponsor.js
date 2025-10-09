class CreateSponsor {
    constructor(
        sponsorName,
        sponsorWebsite,
        sponsorImageId
    ) {
        this.sponsorName = sponsorName;
        this.sponsorWebsite = sponsorWebsite;
        this.sponsorImageId = sponsorImageId;
    }

    validate() {
        const errors = [];

        if (!this.sponsorName) {
            errors.push("Missing Sponsor Name");
        }

        if (!this.sponsorWebsite) {
            errors.push("Missing Sponsor Website");
        }

        return errors;
    }
}

module.exports = CreateSponsor;