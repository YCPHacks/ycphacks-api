const express = require('express')
const router = express.Router()

const {
    getAllSponsors,
    createSponsor,
    updateSponsor,
    deleteSponsor
} = require('../controllers/SponsorController');

router.get("/all", getAllSponsors);

router.post("/", createSponsor);

router.put("/:id", updateSponsor);

router.delete("/:id", deleteSponsor);

module.exports = router;