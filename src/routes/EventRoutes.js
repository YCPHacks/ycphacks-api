const express = require('express')
const router = express.Router()

const {
    createEvent,
    getAllEvents,
    getEventById,
    createActivity,
    getActivitiesForEvent,
    createCategory,
    getCategoriesForEvent,
    addPrizeToCategory,
    getPrizesForCategory,
    editCategory,
    editActivity,
    updateEvent
} = require('../controllers/EventController')

router.post('/create', createEvent)
router.get('/all', getAllEvents)
router.get('/:id', getEventById)
router.post('/activity/', createActivity)
router.get('/activity/:id', getActivitiesForEvent)
router.post('/category/', createCategory)
router.get('/category/:id', getCategoriesForEvent)
router.post('/category/prize', addPrizeToCategory);
router.get('/category/:categoryId/prizes', getPrizesForCategory);
router.put('/category', editCategory)
router.put('/activity', editActivity)
router.put('/update', updateEvent)


module.exports = router;