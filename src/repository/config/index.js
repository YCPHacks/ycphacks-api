// src/models/index.js
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

let sequelize;

if (process.env.NODE_ENV === "test") {
  // Use a mock Sequelize connection
  const SequelizeMock = require("sequelize-mock");
  const DBConnectionMock = new SequelizeMock();
  DBConnectionMock.sync = async () => {};
  sequelize = DBConnectionMock;
} else {
  // Real database connection
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: "mysql",
      logging: false,
    }
  );

  // Test the connection
  sequelize
    .authenticate()
    .then(() => console.log("✅ Connection established successfully."))
    .catch((err) => console.error("❌ Unable to connect to the database:", err));
}

// Export everything
module.exports = { sequelize };