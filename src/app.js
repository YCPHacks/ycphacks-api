// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const registrationRoutes = require('./routes/registrationRoutes');
const sequelize = require('./models'); // Import the Sequelize instance

const app = express();

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:5173', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

app.use(bodyParser.json());

// Use your routes
app.use('/registration', registrationRoutes);

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'CORS is working!' });
});

// Start the server after syncing the models
const port = process.env.APP_PORT || 3000;

sequelize
    .sync({ alter: true }) // Sync models with the database
    .then(() => {
        console.log('Database synchronized successfully.');
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Error syncing the database:', err);
    });
