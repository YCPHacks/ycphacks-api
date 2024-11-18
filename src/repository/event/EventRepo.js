const Event = require("./Event")

const EventRepo = {
    async create(event) {
        return Event.create(event)
    },
    async findById(id) {
        return Event.findOne({
            where: { id }
        })
    },
    async getAll() {
        return Event.findAll()
    }
}

module.exports = EventRepo