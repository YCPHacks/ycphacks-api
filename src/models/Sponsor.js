class Sponsor {
    constructor(
        id,
        sponsorName,
        sponsorWebsite,
        sponsorImageId,
        amount
    ) {
        this.id = id;
        this.sponsorName = sponsorName;
        this.sponsorWebsite = sponsorWebsite;
        this.sponsorImageId = sponsorImageId;
        this.amount = amount;

        if (!this.sponsorName) {
            errors.push("Missing Sponsor Name");
        }

        if(!this.sponsorWebsite) {
            errors.push("Missing Sponsor Website");
        }

        return errors;
    }
}

module.exports = Sponsor;