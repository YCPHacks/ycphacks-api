const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/index');
module.exports = sequelize.define('HardwareType', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
  name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  imageUrl: { type: DataTypes.STRING(255), allowNull: true }
}, { tableName: 'HardwareType' });
