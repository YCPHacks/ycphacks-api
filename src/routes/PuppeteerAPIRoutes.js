const express = require('express');
const router = express.Router();

const PuppeteerController =  require('../controllers/PuppeteerController');
const {authToken, authorizeByRole} = require("../middleware/authMiddleware");

// Protected - only oscar will be able to create a pdf of all the teams
router.get('/teamPDF/:eventId', authToken, authorizeByRole("oscar"), PuppeteerController.createPDF);
module.exports = router;