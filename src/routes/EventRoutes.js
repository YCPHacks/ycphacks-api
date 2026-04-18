const express = require('express')
const router = express.Router()

const {
    createEvent,
    getAllEvents,
    getEventById,
    getActiveEvent,
    editEvent,
    deleteEvent,
    createActivity,
    getActivitiesForEvent,
    editActivity,
    updateEvent,
    deleteActivity
} = require('../controllers/EventController')
const {authToken, authorizeByRole} = require("../middleware/authMiddleware");

// Protected - oscar only
router.post('/create', authToken, authorizeByRole("oscar"), createEvent)
// Protected - oscar only
router.get('/all', authToken, authorizeByRole("oscar", "staff", "participant"), getAllEvents)
// Public
router.get('/active', getActiveEvent)
// Public
router.get('/:id', getEventById)
// Protected - oscar only
router.put('/update', authToken, authorizeByRole("oscar"), editEvent)
// Protected - oscar only
router.delete('/delete/:id', authToken, authorizeByRole("oscar"), deleteEvent)
// Protected - oscar only
router.post('/activity/', authToken, authorizeByRole("oscar"), createActivity)
// Public
router.get('/activity/:id', getActivitiesForEvent)
// Protected - oscar only
router.delete('/activity/:id', authToken, authorizeByRole("oscar"), deleteActivity)
// Protected - oscar only
router.put('/activity', authToken, authorizeByRole("oscar"), editActivity)
// Protected - oscar only
router.put('/update', authToken, authorizeByRole("oscar"), updateEvent)

module.exports = router;