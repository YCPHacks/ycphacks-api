class Hardware {
    constructor(
        id,
        hardwareName,
        quantity,
        whoHasId,
        description
    ) {
        this.id = id;
        this.hardwareName = hardwareName;
        this.quantity = quantity;
        this.whoHasId = whoHasId;
        this.description = description;
    }
}

module.exports = Hardware;