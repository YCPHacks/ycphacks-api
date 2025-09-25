const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const EventParticipants = sequelize.define(
    'EventParticipant',
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
        tableName: 'EventParticipant',
        timestamps: false,
    }
);

module.exports = EventParticipants;