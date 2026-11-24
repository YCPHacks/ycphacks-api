const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/index');

const EventParticipant = sequelize.define(
    'EventParticipant',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        eventId: {
            type: DataTypes.INTEGER,
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
            allowNull: true,
            references: {
                model: 'Team',
                key: 'id'
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        },
        checkIn: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        }
    },
    {
        tableName: 'EventParticipant',
        timestamps: false,
    }
);

module.exports = EventParticipant;