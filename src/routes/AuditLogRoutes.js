const express = require('express')
const router = express.Router()
const { getAllLogs } = require('../controllers/AuditLogController')
const {authToken, authorizeByRole} = require("../middleware/authMiddleware");

// Protected - Oscar only
router.post('/search', authToken, authorizeByRole("oscar"), getAllLogs);

module.exports = router;