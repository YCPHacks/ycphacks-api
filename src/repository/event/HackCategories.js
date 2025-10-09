const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

<<<<<<< Updated upstream:src/repository/event/HackCategories.js
const HackCategories = sequelize.define(
    'HackCategory',
=======
<<<<<<< HEAD:src/repository/event/HackCategory.js
const HackCategory = sequelize.define(
    'HackCategories',
=======
const HackCategories = sequelize.define(
    'HackCategory',
>>>>>>> sponsors:src/repository/event/HackCategories.js
>>>>>>> Stashed changes:src/repository/event/HackCategory.js
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        categoryName: {
            type: DataTypes.STRING(100), // Matches varchar(100)
            allowNull: false,
            require: true
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            require: true
        },
    },
    {
        tableName: 'HackCategory',
        timestamps: false
    }
);

module.exports = HackCategories;