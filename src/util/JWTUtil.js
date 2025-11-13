const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
// const {Logger} = require("concurrently");

// Load environment variables from .env file (if you're using dotenv)
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable or default
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'; // Example: 1 hour

// Generate a new JWT token
function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Validate and verify a JWT token
function validateToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return { valid: false, error: err.message };  // Return error if invalid
    }
}

// Middleware to protect routes (optional, use if you want protected routes)
function authMiddleware(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];  // Expecting token in 'Bearer <token>' format

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const validation = validateToken(token);

    if (!validation.valid) {
        return res.status(401).json({ message: 'Invalid token', error: validation.error });
    }

    req.user = validation.decoded;  // Attach decoded token data to request
    next();  // Proceed to next middleware or route handler
}

module.exports = {
    generateToken,
    validateToken,
    authMiddleware
};
