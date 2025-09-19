class Hardware {
    constructor(
        id,
        hardwareName,
        serial,
        whoHasId,
        description,
        functional
    ) {
        this.id = id;
        this.hardwareName = hardwareName;
        this.serial = serial;
        this.whoHasId = whoHasId;
        this.description = description;
        this.functional = functional;
    }
}

module.exports = Hardware;