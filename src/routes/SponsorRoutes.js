const express = require('express')
const router = express.Router()

const EventSponsorController = require('../controllers/EventSponsorController');

router.get("/", EventSponsorController.getEventSponsors);
router.post("/", EventSponsorController.addSponsorToEvent);
router.put("/:id", EventSponsorController.updateEventSponsor);
router.delete("/:id", EventSponsorController.removeEventSponsor);
router.get("/tiers", EventSponsorController.getSponsorTiers);
router.get("/by-event/:eventId", EventSponsorController.getSponsorsByEvent); 

module.exports = router;