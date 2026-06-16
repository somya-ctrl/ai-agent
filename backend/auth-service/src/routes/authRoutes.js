const express = require('express')
const router = express.Router()
const { login, verifyToken } = require('../controllers/authController')

// Public
router.post('/login', login)

// Internal — called by the API gateway to validate a JWT
router.get('/verify', verifyToken)

module.exports = router
