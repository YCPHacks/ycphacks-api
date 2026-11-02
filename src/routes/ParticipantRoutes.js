const express = require('express');
const router = express.Router();


const {
    getParticipantByEventAndUser
} = require('../controllers/EventParticipantsController');

const {authToken} = require("../middleware/authMiddleware");

router.get('', authToken, getParticipantByEventAndUser);

module.exports = router;