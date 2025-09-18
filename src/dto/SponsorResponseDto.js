class SponsorResponseDto {
    constructor(
        id,
        sponsorName,
        sponsorWebsite,
        sponsorImageId,
    ) {
        this.id = id;
        this.sponsorName = sponsorName;
        this.sponsorWebsite = sponsorWebsite;
        this.sponsorImageId = sponsorImageId;
    }
}

module.exports = SponsorResponseDto;