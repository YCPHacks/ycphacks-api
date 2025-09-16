// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./repository/config/index');
const userRoutes = require('./routes/UserRoutes');
const eventRoutes = require('./routes/EventRoutes');
const app = express();
const { authMiddleware } = require('./util/JWTUtil');

// this is unused but is required for sequelize to sync the models
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

// Database + server start
const port = process.env.APP_PORT || 3000;

sequelize
    .sync({ alter: true })
    .then(() => {
        console.log('Database synchronized successfully.');
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Error syncing the database: ', err);
    });

module.exports = app;