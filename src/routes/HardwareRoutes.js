const express = require('express')
const router = express.Router()
const HardwareController = require('../controllers/HardwareController');

//GET all hardware items
router.get("/", HardwareController.getAllHardware);

//GET Availability
router.get('/availability', HardwareController.getHardwareAvailability);

//GET one hardware item
router.get('/:id', HardwareController.getHardwareById);

//POST new hardware

//PUT update

//DELETE

module.exports = router;