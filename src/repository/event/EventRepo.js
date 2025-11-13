const Event = require("./Event")
const HackCategories = require("./HackCategory")
const Prize = require('./Prize');
const Activity = require("./Activity");


const EventRepo = {
    async createEvent(event) {
        return Event.create(event)
    },

    async updateEvent(event) {
        return Event.update({ ...event }, { where: { id: event.id } })
    },

    async findEventById(eventId) {
        return Event.findOne({ where: { id: eventId } })
    },

    async findActiveEvent() {
        return Event.findOne({ where: { isActive: true } })
    },

    async getAllEvents() {
        return Event.findAll()
    },

    async deleteEvent(eventId) {
        return Event.destroy({ where: { id: eventId } })
    },

    async createActivity(activity) {
        return Activity.create(activity);
    },

    async updateActivity(newActivity) {
        return Activity.update({ ...newActivity }, { where: { id: newActivity.id }});
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
<<<<<<< HEAD
    },
    async updateEvent(event) {
        return Event.update(
            {...event},
            {
                where: { id: event.id }
            }
        )
    },
    async addPrizeToCategory(categoryId, prizeData) {
        // fetch the category to get its eventId
        const category = await HackCategories.findByPk(categoryId);
        if (!category) return null;

        console.log("Category loaded:", category.toJSON()); // << add this


        const createdPrize = await Prize.create({
            prizeName: prizeData.prizeName,
            placement: prizeData.placement,
            categoryId: category.id,
            eventId: category.eventId // derived from category
        });

        return createdPrize;
    },
    async getPrizesForCategory(categoryId) {
        return Prize.findAll({ where: { categoryId } });
=======
>>>>>>> origin/main
    }
}

module.exports = EventRepo