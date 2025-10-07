// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/UserRoutes');
const eventRoutes = require('./routes/EventRoutes');
const hardwareRoutes = require('./routes/HardwareRoutes');
const sequelize = require('./repository/config'); 
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
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

app.use(bodyParser.json());

// Use your routes
app.use('/user', userRoutes)
app.use('/event', eventRoutes)
app.use('/hardware', hardwareRoutes)

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'CORS is working!' });
});

// Start the server after syncing the models
const port = process.env.APP_PORT || 3000;
async function startServer() {
  try {
    if (process.env.NODE_ENV !== 'test') {
      // Sync only in non-test environments
      await sequelize.sync({ alter: true });
      console.log('✅ Database synchronized successfully.');
    }
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('❌ Error syncing the database:', err);
    process.exit(1); // optional: stop server if DB fails
  }
}

module.exports = app;

if(require.main === module){
  startServer();
}