const express = require('express')
const router = express.Router()
const HardwareController = require('../controllers/HardwareController');

//GET all hardware items
router.get("/", HardwareController.getAllHardware);

router.get("/admin", HardwareController.getAllHardwareAdmin);

//GET Availability
router.get('/availability', HardwareController.getHardwareAvailability);

//GET one hardware item
router.get('/:id', HardwareController.getHardwareById);

//POST new hardware
router.post('/add', HardwareController.createHardware);

//PUT  hardware update
router.put('/update/:id', HardwareController.updateHardware);

//hardware DELETE
router.delete('/delete/:id', HardwareController.deleteHardware);

module.exports = router;