class Image{
    constructor(
        url
    ){
        this.url = url;
    }

    validate() {
        const errors = [];
        if(!this.url){
            errors.push("Missing Image URL");
        }

        return errors;
    }
}

module.exports = Image;