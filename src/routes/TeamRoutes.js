const express = require('express');
const router = express.Router();

const TeamController = require('../controllers/TeamController');

router.post('/create', TeamController.createTeam);
router.get('/all', TeamController.getAllTeams);

module.exports = router;