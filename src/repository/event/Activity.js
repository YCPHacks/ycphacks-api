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
            type: DataTypes.STRING,
            allowNull: false
        },
        activityDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Event',
                key: 'id'
            }
        },
    },

    {
        tableName: 'Activity',
        timestamps: false
    }
);

module.exports = Activity;