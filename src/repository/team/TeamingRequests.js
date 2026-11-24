const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/index');

const TeamingRequests = sequelize.define(
    'TeamingRequests',
    {
        teamId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'Team',
                key: 'id'
            }
        },
        participantId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'EventParticipant',
                key: 'id'
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },

    {
        tableName: 'TeamingRequests',
        timestamps: true,
        updatedAt: false
    }
);

module.exports = TeamingRequests;