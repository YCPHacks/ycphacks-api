const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/index');

const Team = sequelize.define(
    'Team',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Event',
                key: 'id'
            }
        },
        teamName: {
            type: DataTypes.STRING(100), // matches varchar(100)
            allowNull: false,
        },
        projectName: {
            type: DataTypes.STRING(100)
        },
        projectDescription: {
            type: DataTypes.STRING
        },
        presentationLink: {
            type: DataTypes.STRING,
        },
        githubLink: {
            type: DataTypes.STRING
        }
    },

    {
        tableName: 'Team'

    }
);

module.exports = Team;