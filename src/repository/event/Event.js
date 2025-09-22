const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

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
   },
   {
       tableName: 'events',
       timestamps: false,
   }
);

module.export = Event;