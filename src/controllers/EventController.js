const EventRepo = require('../repository/event/EventRepo')
const CreateEvent = require('../models/CreateEvent')

const createEvent = async (req, res) => {
    try {
        const createEventDto = req.body

        const event = new CreateEvent(
            eventName = createEventDto.eventName,
            startDate = createEventDto.startDate,
            endDate = createEventDto.endDate,
            canChange = true,
        )

        // validate data and throw error if not valid
        const validationErrors = event.validate()
        if (validationErrors.length > 0) {
            return res.status(400).json({
                message: 'Validation errors occurred',
                errors: validationErrors
            });
        }

        const psersistedEvent = await EventRepo.create(event)

        // create sechdule and prizes, these will be empty arrays 
        // but need to be initialized in the database

        return res.status(201).json({
            message: 'Event created successfully',
            event: psersistedEvent
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

module.exports = {
    createEvent,
    getAllEvents,
    getEventById
}