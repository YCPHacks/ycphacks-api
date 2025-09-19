class SponsorResponseDto {
    constructor(
        sponsorName,
        sponsorWebsite,
        sponsorImageId
    ) {
        this.sponsorName = sponsorName;
        this.sponsorWebsite = sponsorWebsite;
        this.sponsorImageId = sponsorImageId;
    }
}

module.exports = SponsorResponseDto;