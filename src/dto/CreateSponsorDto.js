class SponsorResponseDto {
    constructor(
        sponsorName,
        sponsorWebsite,
        imageURL,
    ) {
        this.sponsorName = sponsorName;
        this.sponsorWebsite = sponsorWebsite;
        this.imageURL = imageURL;
    }
}

module.exports = SponsorResponseDto;