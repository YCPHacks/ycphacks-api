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
    createCategory,
    getCategoriesForEvent,
    addPrizeToCategory,
    getPrizesForCategory,
    editCategory,
    editActivity
} = require('../controllers/EventController')

router.post('/create', createEvent)
router.get('/all', getAllEvents)
router.get('/active', getActiveEvent)
router.get('/:id', getEventById)
router.put('/update', editEvent)
router.delete('/delete/:id', deleteEvent)
router.post('/activity/', createActivity)
router.get('/activity/:id', getActivitiesForEvent)
router.post('/category/', createCategory)
router.get('/category/:id', getCategoriesForEvent)
router.post('/category/prize', addPrizeToCategory);
router.get('/category/:categoryId/prizes', getPrizesForCategory);
router.put('/category', editCategory)
router.put('/activity', editActivity)


module.exports = router;