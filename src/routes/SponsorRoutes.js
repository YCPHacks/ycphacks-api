const express = require('express');
const router = express.Router();

const { checkBodyForSpecialCharacters } = require('../middleware/validationMiddleware');
const EventSponsorController = require('../controllers/EventSponsorController');
const { authMiddleware } = require('../util/JWTUtil');

router.get("/", EventSponsorController.getEventSponsors);
router.post("/", 
    authMiddleware,
    checkBodyForSpecialCharacters, 
    EventSponsorController.addSponsorToEvent);
router.put("/:id", 
    authMiddleware,
    checkBodyForSpecialCharacters,
    EventSponsorController.updateEventSponsor);
router.delete("/:id", 
    authMiddleware,
    checkBodyForSpecialCharacters,
    EventSponsorController.removeEventSponsor);
router.get("/tiers", EventSponsorController.getSponsorTiers);
router.get("/by-event/:eventId", EventSponsorController.getSponsorsByEvent); 

module.exports = router;