const express = require('express')
const router = express.Router()
const HardwareController = require('../controllers/HardwareController');

//GET all hardware items
router.get("/", HardwareController.getAllHardware);

//GET one hardware item

//POST new hardware

//PUT update

//DELETE

module.exports = router;