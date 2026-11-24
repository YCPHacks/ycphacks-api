const express = require('express');
const router = express.Router();

const EventParticipantController = require('../controllers/EventParticipantsController');

const {authToken} = require("../middleware/authMiddleware");


router.get('', authToken, EventParticipantController.getParticipantByEventAndUser);
router.get('/:participantId/incomingTeamingRequests', EventParticipantController.getIncomingTeamingRequests);
router.post('/:participantId/acceptTeamingRequest', EventParticipantController.assignParticipant);
router.post('/:participantId/declineTeamingRequest', EventParticipantController.declineIncomingTeamRequest);

module.exports = router;