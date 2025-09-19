const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

const EventParticipant = sequelize.define(
    'EventParticipant',
    {
        eventId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'Event',
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id'
            }
        },
        teamId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Team',
                key: 'id'
            }
        }
    },
    {
        tableName: 'EventParticipant',
        timestamps: false,
    }
);

module.exports = EventParticipant;