const express = require('express');
const router = express.Router();

const TeamController = require('../controllers/TeamController');
const EventParticipantController = require('../controllers/EventParticipantsController');

router.post('/create', TeamController.createTeam);
router.get('/all', TeamController.getAllTeams);
router.get('/unassignedParticipants', EventParticipantController.getUnassignedParticipants);
router.put('/:id', TeamController.updateTeam);
router.delete('/:id', TeamController.deleteTeam);
router.put('/unassign', EventParticipantController.unassignParticipant);
router.get('/:userId/team', EventParticipantController.getUserTeamStatus);

module.exports = router;