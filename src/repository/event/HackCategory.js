const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

const HackCategory = sequelize.define(
    'HackCategories',
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
        tableName: 'hack_categories',
        timestamps: false
    }
);

module.exports = HackCategory;