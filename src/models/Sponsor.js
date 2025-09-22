class Sponsor{
    constructor(
        sponsor_name,
        sponsor_website,
        image_id,
    ){
        this.sponsor_name = sponsor_name;
        this.sponsor_website = sponsor_website;
        this.image_id = image_id;
    }
    validate() {
        const errors = [];

        if (!this.sponsor_name) {
            errors.push("Missing Sponsor Name");
        }

        if(!this.sponsor_website) {
            errors.push("Missing Sponsor Website");
        }

        return errors;
    }
}

module.exports = Sponsor;