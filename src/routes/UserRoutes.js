const express = require('express');
const router = express.Router();

const {
    createUser,
    createQRCode,
    loginUser,
    loginAdminUser,
    authWithToken,
    getUserById,
    getProfileById,
    getAllUsers,
    updateCheckIn,
    updatePassword,
    updateUserById,
    validateQR
} = require('../controllers/UserController')
const EventParticipantController= require('../controllers/EventParticipantsController')
const { checkBodyForSpecialCharacters, userValidationRules, validate } = require('../middleware/validationMiddleware')
const { authToken, authorizeByRole, isOwnerOfRequestedId} = require('../middleware/authMiddleware')

// Protected
router.post('/validate-qr', authToken, authorizeByRole("oscar", "staff"), validateQR);

// Public
router.post('/register', userValidationRules, validate, createUser);

// Protected - Participants can only access their own account qr code
router.get('/:id/qrcode', authToken, authorizeByRole("oscar", "staff", "participant"), createQRCode);

// Public
router.post('/login', checkBodyForSpecialCharacters, loginUser);

// Public
router.post('/admin-login', checkBodyForSpecialCharacters, loginAdminUser);

// Protected
router.post('/auth', authToken, authWithToken);

// Protected
router.get('/all',authToken, authorizeByRole("oscar", "staff"), EventParticipantController.getUsersByEvent);

// Public
router.get('/event/:eventId/staff', EventParticipantController.getStaffForEvent);

// Protected - only staff/oscar can check people in
router.put('/:id/checkin', authToken, authorizeByRole("oscar", "staff"), updateCheckIn);

// Protected - everyone can only reset their own password regardless of role
router.put('/:id/updatePassword', authToken, isOwnerOfRequestedId, updatePassword);

// Protected - Participants can only update their own info
router.put('/:id', authToken, authorizeByRole("oscar", "staff", "participant"), checkBodyForSpecialCharacters, updateUserById);

// Protected - Participants can only get their own info
router.get('/:id', authToken, authorizeByRole("oscar", "staff", "participant"), getUserById);

// Protected - Participants can only update their own info
router.get('/:id/profile', authToken, authorizeByRole("oscar", "staff", "participant"), getProfileById);


module.exports = router;