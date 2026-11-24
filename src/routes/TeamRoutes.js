const express = require('express');
const router = express.Router();

const TeamController = require('../controllers/TeamController');
const EventParticipantController = require('../controllers/EventParticipantsController');

router.post('/create', TeamController.createTeam);
router.get('/all', EventParticipantController.getTeamsByEvent);
router.get('/unassignedParticipants', EventParticipantController.getUnassignedParticipants);
router.put('/unassign', EventParticipantController.unassignParticipant);
router.put('/:id', TeamController.updateTeam);
router.delete('/:id', TeamController.deleteTeam);
router.get('/:teamId/members', TeamController.getTeamMembers);
router.get('/:teamId/teamLeader', TeamController.getTeamLeaderId);
router.get('/:teamId/project-details', TeamController.getTeamProjectDetails);
router.put('/:teamId/teamLeader', TeamController.updateTeamLeader);
router.put('/:teamId/project-details', TeamController.updateTeamProjectDetails);
router.get('/:teamId/outgoingTeamingRequests', TeamController.getOutgoingTeamingRequests);
router.post('/:teamId/sendTeamingRequest', TeamController.sendOutgoingTeamingRequest);
router.post('/:teamId/rescindTeamingRequest', TeamController.rescindOutgoingTeamingRequest);
module.exports = router;