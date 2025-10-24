const express = require('express');
const router = express.Router();

const {
    createUser,
    loginUser,
    loginAdminUser,
    authWithToken,
    getAllUsers, updateCheckIn, updateUser
} = require('../controllers/UserController')

router.post('/register', createUser)

router.post('/login', loginUser)

router.post('/admin-login', loginAdminUser);

router.post('/auth', authWithToken)

router.get('/all', getAllUsers)

router.put('/:id/checkin', updateCheckIn);

router.put('/:id', updateUser);

module.exports = router;