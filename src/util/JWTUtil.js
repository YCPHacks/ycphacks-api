const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
// const {Logger} = require("concurrently");

// Load environment variables from .env file (if you're using dotenv)
dotenv.config();

// Uses secret key located in .env
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN

// Generate a new JWT token
function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Validate and verify a JWT token
function validateToken(token) {
    try {
        const decoded = jwt.verify(token,JWT_SECRET);
        return {valid: true, decoded: decoded}
    } catch (err) {
        return { valid: false, error: err.message };  // Return error if invalid
    }
}

module.exports = {
    generateToken,
    validateToken
};
