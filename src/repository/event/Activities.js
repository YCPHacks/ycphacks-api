const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Activity = sequelize.define(
    'Activity',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        activityName: {
            type: DataTypes.STRING(100), // Matches varchar(100)
            allowNull: false,
            require: true
        },
        activityDate: {
            type: DataTypes.DATE, // Matches date type
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
        tableName: 'Activity',
        timestamps: false
    }
);

module.exports = Activity;