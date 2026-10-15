const express = require('express')
const router = express.Router()
const HardwareController = require('../controllers/HardwareController');
const {authToken, authorizeByRole} = require("../middleware/authMiddleware");

// Public
router.get("/", HardwareController.getAllHardware);

// Protected - staff and oscar only
router.get("/admin", authToken, authorizeByRole("oscar", "staff"), HardwareController.getAllHardwareAdmin);

// Public
router.get('/availability', HardwareController.getHardwareAvailability);

router.get('/types', HardwareController.getTypes);

router.post('/types', authToken, authorizeByRole('oscar'), HardwareController.createType);

router.put('/types/:id', authToken, authorizeByRole('oscar'), HardwareController.updateType);
// Public - GET one hardware item
router.get('/:id', HardwareController.getHardwareById);

// Protected - POST new hardware - oscar only
router.post('/add', authToken, authorizeByRole("oscar"), HardwareController.createHardware);

// Protected - PUT hardware update - oscar only
router.put('/update/:id',  authToken, authorizeByRole("oscar"), HardwareController.updateHardware);

// Protected - hardware DELETE - oscar only
router.delete('/delete/:id', authToken, authorizeByRole("oscar"), HardwareController.deleteHardware);

// Protected - oscar only
router.post('/import', authToken, express.text({ type: 'text/csv'} ),authorizeByRole("oscar"), HardwareController.importCSVHardware)

module.exports = router;