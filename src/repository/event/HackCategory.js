const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const HackCategory = sequelize.define(
<<<<<<< HEAD:src/repository/event/HackCategories.js
    'HackCategory',
=======
    'HackCategories',
>>>>>>> 0a0d17913dcbf798e7818f5af75de29369b7b063:src/repository/event/HackCategory.js
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

module.exports = HackCategory;