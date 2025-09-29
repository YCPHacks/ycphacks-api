const express = require('express')
const router = express.Router()

const {
    getAllSponsors,
    createSponsor,
    updateSponsor,
    deleteSponsor,
    getSponsorData
} = require('../controllers/SponsorController');

router.get("/", getAllSponsors);
router.get("/:id", getSponsorData);

router.post("/", createSponsor);

router.put("/:id", updateSponsor);

router.delete("/:id", deleteSponsor);

module.exports = router;