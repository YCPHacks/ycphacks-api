// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/UserRoutes');
const eventRoutes = require('./routes/EventRoutes');
const app = express();
const { authMiddleware } = require('./util/JWTUtil');

// this is unused but is required for sequlize to sync the models
const models = require('./repository/config/Models');
// CORS configuration
const corsOptions = {
    origin: process.env.CORS, // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
//app.use(cors(corsOptions));
//app.options('*', cors(corsOptions)); // Enable pre-flight for all routes
app.use(cors({
    origin: process.env.CORS,
    credentials: true,
}));
app.use(express.json());

// Use your routes
app.use('/user', userRoutes)
app.use('/event', eventRoutes)

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'CORS is working!' });
});

module.exports = app;