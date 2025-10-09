const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/index');

const HardwareImage = sequelize.define(
    'HardwareImage',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false
        },
        hardwareId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Hardware',
                key: 'id'
            },
        }
    },

    {
        tableName: 'HardwareImage'
    }
)

module.exports = HardwareImage;