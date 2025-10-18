const EventRepo = require('../repository/event/EventRepo')
const CreateEvent = require('../models/CreateEvent')

const createEvent = async (req, res) => {
    try {
        const createEventDto = req.body

        const event = new CreateEvent(
            createEventDto.eventName,
            createEventDto.startDate,
            createEventDto.endDate,
            true,
            new Date().getFullYear()
        )

        // validate data and throw error if not valid
        const validationErrors = event.validate()
        if (validationErrors.length > 0) {
            return res.status(400).json({
                message: 'Validation errors occurred',
                errors: validationErrors
            });
        }

        const persistedEvent = await EventRepo.create(event)

        // create schedule and prizes, these will be empty arrays
        // but need to be initialized in the database

        return res.status(201).json({
            message: 'Event created successfully',
            event: persistedEvent
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const getAllEvents = async (req, res) => {
    try {
        const events = await EventRepo.getAll()
        return res.status(200).json({
            message: 'Events retrieved successfully',
            events: events
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const getEventById = async (req, res) => {
    const { id } = req.params; // Extract the ID from the URL

    try {
        const event = await EventRepo.findById(id)

        if (!event) {
            return res.status(404).json({
                message: 'Event not found'
            });
        } else {
            return res.status(200).json({
                message: 'Event retrieved successfully',
                event: event
            });
        }
    } catch (e){
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const createActivity = async (req, res) => {
    try {
        const activity = {
            activityName: req.body.activityName,
            activityDate: req.body.activityDate,
            activityDescription: req.body.activityDescription,
            eventId: req.body.eventId
        }

        const createdActivity = await EventRepo.createActivity(activity)

        if (!createdActivity) {
            return res.status(404).json({
                message: 'Event not found'
            });
        } else {
            return res.status(201).json({
                message: 'Activity created successfully',
                activity: createdActivity
            });
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: e
        });
    }
}


const getActivitiesForEvent = async (req, res) => {

    const { id } = req.params;

    try {
        const activities = await EventRepo.getAllActivities(id)
        return res.status(200).json({
            message: 'Activities retrieved successfully',
            activities: activities
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const editActivity = async (req, res) => {
    try {
        const activity = {
            id: req.body.id,
            activityName: req.body.activityName,
            activityDate: req.body.activityDate,
            activityDescription: req.body.activityDescription,
            eventId: req.body.eventId
        }

        const updatedActivity = await EventRepo.updateActivity(activity)
        return res.status(200).json({
            message: 'Activity updated successfully',
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const createCategory = async (req, res) => {
    try {

        const category = {
            categoryName: req.body.categoryName,
            eventId: req.body.eventId
        }

        const createdCategory = await EventRepo.createCategory(category)

        if (!createdCategory) {
            return res.status(404).json({
                message: 'Event not found'
            });
        } else {
            return res.status(201).json({
                message: 'Category created successfully',
                activity: createdCategory
            });
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: e
        });
    }
}
const getCategoriesForEvent = async (req, res) => {

    const { id } = req.params;

    try {
        const categories = await EventRepo.getAllCategories(id)
        return res.status(200).json({
            message: 'categories retrieved successfully',
            categories: categories
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const editCategory = async (req, res) => {
    try {
        const category = {
            id: req.body.id,
            categoryName: req.body.categoryName,
            eventId: req.body.eventId
        }

        const updatedCategory = await EventRepo.updateCategory(category)
        return res.status(200).json({
            message: 'categories updated successfully',
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const updateEvent = async (req, res) => {
    try {
        const event = {
            id: req.body.id,
            eventName: req.body.eventName,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            canChange: req.body.canChange
        }

        const updatedEvent = await EventRepo.updateEvent(event)
        return res.status(200).json({
            message: 'Event updated successfully',
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    createActivity,
    getActivitiesForEvent,
    createCategory,
    getCategoriesForEvent,
    editCategory,
    editActivity,
    updateEvent
}