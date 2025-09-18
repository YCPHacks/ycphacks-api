const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

const Hardware = sequelize.define(
    'Hardware',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        hardwareName: {
            type: DataTypes.STRING(100), // Matches varchar(100)
            allowNull: false,
            require: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        whoHasId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'User',
                key: 'id'
            },
            defaultValue: 0
        },
        description: {
            type: DataTypes.STRING
        }
    }
)

module.exports = Hardware;