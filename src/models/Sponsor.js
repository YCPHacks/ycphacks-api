class Sponsor {
    constructor(
        id,
        sponsorName,
        sponsorWebsite,
        sponsorImageId
    ) {
        this.id = id;
        this.sponsorName = sponsorName;
        this.sponsorWebsite = sponsorWebsite;
        this.sponsorImageId = sponsorImageId;

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