const EventRepo = require('../repository/event/EventRepo')
const CreateEvent = require('../models/CreateEvent')
const Activity = require('../models/Activity');
const ActivityResponseDto = require('../dto/ActivityResponseDto');

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
        const activityData = req.body;
        const activity = new Activity(
            null,
            activityData.activityName,
            activityData.activityDate,
            activityData.activityDescription,
            activityData.eventId
        );

        // Validate data
        const validationErrors = activity.validate(true);
        if (Object.keys(validationErrors).length > 0) {
            return res.status(400).json({
                message: 'Validation errors occurred',
                errors: validationErrors
            });
        }

        // Convert to plain object for Sequelize
        const activityObj = {
            activityName: activity.activityName,
            activityDate: activity.activityDate,
            activityDescription: activity.activityDescription,
            eventId: activity.eventId
        }

        const createdActivity = await EventRepo.createActivity(activityObj)

        if (!createdActivity) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        // Create activity response DTO
        const activityResponseDto = new ActivityResponseDto(
          createdActivity.id,
          createdActivity.activityName,
          createdActivity.activityDate,
          createdActivity.activityDescription,
          createdActivity.eventId
        );

        return res.status(201).json({
            message: 'Activity created successfully',
            activity: activityResponseDto
        });
    } catch (e) {
        return res.status(500).json({
            message: 'Error creating activity',
            error: e.message || e
        });
    }
}


const getActivitiesForEvent = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch activities and convert dates from DB to user-friendly dates (i.e., 12-hour format
        const activities = (await EventRepo.getAllActivities(id)).map(activity => {
            activity.activityDate = activity.activityDate.toISOString();
            return activity;
        })

        return res.status(200).json({
            message: 'Activities retrieved successfully',
            activities: activities
        });
    } catch (e) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: e.message || e
        });
    }
}

const editActivity = async (req, res) => {
    try {
        const activityData = req.body;

        // Check existence of activity
        const existingActivity = await EventRepo.findActivityById(activityData.id);
        if (!existingActivity) return res.status(404).json({ message: 'Activity not found' });

        const activity = new Activity(
            activityData.id,
            activityData.activityName,
            activityData.activityDate,
            activityData.activityDescription,
            activityData.eventId
        );

        // Validate data
        const validationErrors = activity.validate(false);
        if (Object.keys(validationErrors).length > 0) {
            return res.status(400).json({
                message: 'Validation errors occurred',
                errors: validationErrors
            });
        }

        // Convert to plain object for Sequelize
        const activityObj = {
            id: activity.id,
            activityName: activity.activityName,
            activityDate: activity.activityDate,
            activityDescription: activity.activityDescription,
            eventId: activity.eventId
        }

        const [rowsUpdated] = await EventRepo.updateActivity(activityObj)

        if (rowsUpdated <= 0) {
            return res.status(404).json({
                message: "Activity could not be updated (event not found)"
            });
        }

        const updatedActivity = await EventRepo.findActivityById(activityObj.id);

        // Create activity response DTO
        const activityResponseDto = new ActivityResponseDto(
            updatedActivity.id,
            updatedActivity.activityName,
            updatedActivity.activityDate.toISOString(),
            updatedActivity.activityDescription,
            updatedActivity.eventId
        );

        return res.status(200).json({
            message: 'Activity updated successfully',
            activity: activityResponseDto
        });
    } catch (e) {
        return res.status(500).json({
            message: 'Error updating activity',
            error: e.message || e
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


const getPrizesForCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const prizes = await EventRepo.getPrizesForCategory(categoryId);

        if (!prizes) {
            return res.status(404).json({ message: 'Category not found or no prizes' });
        }
        return res.status(200).json({
            message: 'Prizes retrieved successfully',
            prizes: prizes
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


const addPrizeToCategory = async (req, res) => {
    try {
        const { categoryId, prizeName, placement } = req.body;

        const createdPrize = await EventRepo.addPrizeToCategory(categoryId, { prizeName, placement });

        if (!createdPrize) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json({
            message: 'Prize added successfully',
            prize: createdPrize
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};





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
    updateEvent,
    addPrizeToCategory,
    getPrizesForCategory
}