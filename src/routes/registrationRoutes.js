const express = require('express');
const router = express.Router();

const {
    registerUser,
    getRegistrations,
    updateRegistrationStatus,
    deleteRegistration,
} = require('../controllers/registrationController');

router.post('/register', registerUser);

router.get('/', getRegistrations);

router.put('/:id/status', updateRegistrationStatus);

router.delete('/:id', deleteRegistration);

module.exports = router;
