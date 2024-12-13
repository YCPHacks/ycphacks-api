const Event = require("./Event")
const Activity = require("./Activities")
const HackCategories = require("./HackCategories")

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

    async createActivity( activity) {
        console.log(activity)
        const event = await Event.findOne({
            where: { id: activity.eventId }
        })
        if (!event) {
            return null
        }
        return Activity.create({
            ...activity
        })
    },

    async getAllActivities(id) {
        return Activity.findAll({
            where: { eventId: id }
        })
    },

    async createCategory( category) {
        console.log(category)
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
    async updateActivity(activity) {
        return Activity.update(
            {...activity},
            {
                where: { id: activity.id }
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