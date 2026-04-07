const express = require('express')
const router = express.Router()

const {
    createCategory,
    getCategoriesForEvent,
    getCategoryById,
    editCategory,
    deleteCategory
} = require('../controllers/HackCategoryController');
const {authToken, authorizeByRole} = require("../middleware/authMiddleware");

// Protected - oscar only
router.post('/create', authToken, authorizeByRole("oscar"), createCategory)
// Public
router.get('/by-event/:eventId', getCategoriesForEvent)
// Public
router.get('/:id', getCategoryById)
// Protected - oscar only
router.put('/update', authToken, authorizeByRole("oscar"), editCategory)
// Protected - oscar only
router.delete('/delete/:id', authToken, authorizeByRole("oscar"), deleteCategory)

module.exports = router;