const express = require('express')
const router = express.Router()

const {
    createPrize,
    getPrizesForEvent,
    getPrizeById,
    editPrize,
    deletePrize
} = require('../controllers/PrizeController');
const {authToken, authorizeByRole} = require("../middleware/authMiddleware");

// Only oscar will be able to create, edit, and delete prizes
// Protected
router.post('/create', authToken, authorizeByRole("oscar"), createPrize)
// Public
router.get('/by-event/:eventId', getPrizesForEvent)
// Public
router.get('/:id', getPrizeById)
// Protected
router.put('/update', authToken, authorizeByRole("oscar"), editPrize)
// Protected
router.delete('/delete/:id', authToken, authorizeByRole("oscar"), deletePrize)

module.exports = router;