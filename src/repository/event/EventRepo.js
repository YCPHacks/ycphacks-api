const Event = require("../../models/Event")
const HackCategories = require("./HackCategory")

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
    },

    async createCategory( category) {
        const event = await Event.findOne({
            where: { id: category.eventId }
        })
        if (!event) {
            return null
        }
        return HackCategories.create({
            ...category
        })
    },
    async getAllCategories(id) {
        return HackCategories.findAll({
            where: { eventId: id }
        })
    },
    async updateCategory(category) {
        return HackCategories.update(
            {...category},
            {
                where: { id: category.id }
            }
        )
    },
    async updateEvent(event) {
        return Event.update(
            {...event},
            {
                where: { id: event.id }
            }
        )
    }
}

module.exports = EventRepo