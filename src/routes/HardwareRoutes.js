const express = require('express')
const router = express.Router()
const HardwareController = require('../controllers/HardwareController');
const HardwareImagesController = require('../controllers/HardwareImagesController');
const {authToken, authorizeByRole} = require("../middleware/authMiddleware");

// Public
router.get("/", HardwareController.getAllHardware);

// Protected - staff and oscar only
router.get("/admin", authToken, authorizeByRole("oscar", "staff"), HardwareController.getAllHardwareAdmin);

// Public
router.get('/availability', HardwareController.getHardwareAvailability);

// Public - GET one hardware item
router.get('/:id', HardwareController.getHardwareById);

// Protected - POST new hardware - oscar only
router.post('/add', authToken, authorizeByRole("oscar"), HardwareController.createHardware);

// Protected - PUT hardware update - oscar only
router.put('/update/:id',  authToken, authorizeByRole("oscar"), HardwareController.updateHardware);

// Protected - hardware DELETE - oscar only
router.delete('/delete/:id', authToken, authorizeByRole("oscar"), HardwareController.deleteHardware);

// Protected - POST hardware image - oscar only
router.post('/image/add', authToken, authorizeByRole("oscar"), HardwareImagesController.createImage);

// Protected - oscar only
router.post('/import', authToken, express.text({ type: 'text/csv'} ),authorizeByRole("oscar"), HardwareController.importCSVHardware)

module.exports = router;