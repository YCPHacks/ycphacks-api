const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

const Analytics = sequelize.define(
    'Analytics',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            require: true
        },
        gender: {
            type: DataTypes.STRING(50) // Matches varchar(50)
        },
        country: {
            type: DataTypes.STRING(100) // Matches varchar(100)
        },
        school: {
            type: DataTypes.STRING
        },
        hackathonsAttended: {
            type: DataTypes.INTEGER
        },
        numOfParticipants: {
            type: DataTypes.INTEGER
        }
    },

    {
        tableName: 'Analytics'
    }
)

module.exports = Analytics;