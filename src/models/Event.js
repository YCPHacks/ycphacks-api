const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../repository/config/index');

class Event extends Model {}

Event.init({
  eventName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  canChange: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  participants: {
    type: DataTypes.JSON // or DataTypes.INTEGER if just a count
  },
  schedule: {
    type: DataTypes.JSON
  },
  sponsors: {
    type: DataTypes.JSON
  },
  prizes: {
    type: DataTypes.JSON
  }
}, {
  sequelize,
  modelName: 'Event'
});

module.exports = Event;