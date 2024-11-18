const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

const EventParticipants = sequelize.define(
    'EventParticipants',
    {
        eventId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            require: true,
        }
    },
    {
        tableName: 'event_participants',
        timestamps: false,
    }
);

module.exports = EventParticipants;