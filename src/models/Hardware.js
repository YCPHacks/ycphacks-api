class Hardware {
    constructor(
        id,
        hardwareName,
        serial,
        whoHasId,
        description,
        functional,
        createdAt,
        updatedAt
    ) {
        this.id = id
        this.hardwareName = hardwareName
        this.serial = serial
        this.whoHasId = whoHasId
        this.description = description
        this.functional = functional
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }
}

module.exports = Hardware;