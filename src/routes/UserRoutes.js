const express = require('express')
const router = express.Router()

const {
    createUser,
    loginUser
} = require('../controllers/UserController')

router.post('/create', createUser)

router.get('/login', loginUser)

module.exports = router;