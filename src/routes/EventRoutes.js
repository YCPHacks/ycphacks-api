const express = require('express')
const router = express.Router()

const {
    createEvent,
    getAllEvents
} = require('../controllers/EventController')

router.post('/create', createEvent)
router.get('/all', getAllEvents)

module.exports = router;