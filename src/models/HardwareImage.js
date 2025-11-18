const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HardwareImage = sequelize.define('HardwareImage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    hardwareId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'hardware_images',
    timestamps: true,
});


module.exports = HardwareImage;