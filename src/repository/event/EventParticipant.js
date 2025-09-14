const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

const EventParticipant = sequelize.define(
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
        teamId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: 'event_participants',
        timestamps: false,
    }
);

module.exports = EventParticipant;