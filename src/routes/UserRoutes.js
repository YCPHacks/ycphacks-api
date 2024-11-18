const express = require('express')
const router = express.Router()

const {
    createUser,
    loginUser,
    loginAdminUser,
    authWithToken,
    getAllUsers
} = require('../controllers/UserController')

router.post('/create', createUser)

router.post('/login', loginUser)

router.post('/admin', loginAdminUser)

router.post('/auth', authWithToken)

router.get('/all', getAllUsers)

module.exports = router;