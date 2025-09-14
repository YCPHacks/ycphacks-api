const express = require('express')
const router = express.Router()

const {
    createUser,
    loginUser,
    loginAdminUser,
    authWithToken,
    getAllUsers
} = require('../controllers/UserController')

router.post('/register', createUser)

router.post('/login', loginUser)

router.post('/admin-login', loginAdminUser)

router.post('/auth', authWithToken)

router.get('/all', getAllUsers)

module.exports = router;