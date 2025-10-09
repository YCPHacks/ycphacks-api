const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Activity = sequelize.define(
    'Activity',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        activityName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        activityDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Event',
                key: 'id'
            }
        },
    },

    {
        tableName: 'Activity',
<<<<<<< HEAD:src/repository/event/Activities.js
        timestamps: false
=======
        timestamps: false,
>>>>>>> 0a0d17913dcbf798e7818f5af75de29369b7b063:src/repository/event/Activity.js
    }
);

module.exports = Activity;