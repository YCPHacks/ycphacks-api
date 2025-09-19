const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

const Event = sequelize.define(
    'Event',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        eventName: {
            type: DataTypes.STRING(100), // Matches varchar(100)
            allowNull: false,
            require: true
        },
        startDate: {
            type: DataTypes.DATE, // Matches date type
            allowNull: false,
            require: true
        },
        endDate: {
            type: DataTypes.DATE, // Matches date type
            allowNull: false,
            require: true
        },
        canChange: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            require: true,
            defaultValue: true
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            require: true,
            defaultValue: new Date().getFullYear() // This will only run when Sequelize sync the model, so we should also check for null values for year and add the current year in the controller or wherever.
        }
    },
    {
        tableName: 'Event',
        timestamps: false,
    }
)

module.exports = Event;