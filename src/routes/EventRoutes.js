const express = require('express')
const router = express.Router()

const {
    createEvent,
    getAllEvents,
    getEventById
} = require('../controllers/EventController')

router.post('/create', createEvent)
router.get('/all', getAllEvents)
router.get('/:id', getEventById)

module.exports = router;