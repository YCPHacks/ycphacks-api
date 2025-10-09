<<<<<<< Updated upstream
class Image{
=======
<<<<<<< HEAD
class Image {
>>>>>>> Stashed changes
    constructor(
        url
    ){
        this.url = url;
    }
<<<<<<< Updated upstream
=======
=======
class Image{
    constructor(
        url
    ){
        this.url = url;
    }
>>>>>>> Stashed changes

    validate() {
        const errors = [];
        if(!this.url){
            errors.push("Missing Image URL");
        }

        return errors;
    }
<<<<<<< Updated upstream
=======
>>>>>>> sponsors
>>>>>>> Stashed changes
}

module.exports = Image;