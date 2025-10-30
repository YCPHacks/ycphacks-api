const Event = require("./Event")
const HackCategories = require("./HackCategory")
const Activity = require("./Activity");


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

    async createActivity(activity) {
        return Activity.create(activity);
    },

    async updateActivity(newActivity) {
        return Activity.update({ ...newActivity }, { where: { id: newActivity.id }});
    },

    async deleteActivity(activityId) {
      return Activity.destroy({ where: { id: activityId } })
    },

    async findActivityById(activityId) {
      return Activity.findOne({ where: { id: activityId } });
    },

    async getAllActivities(eventId) {
        return Activity.findAll({ where: { eventId: eventId } });
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