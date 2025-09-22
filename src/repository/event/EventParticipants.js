const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
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
            tableName: 'event_participants',
            timestamps: false,
        }
    );
};