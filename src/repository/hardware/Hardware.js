const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/index');

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
        serial: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        whoHasId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'User',
                key: 'id'
            }
        },
        description: {
            type: DataTypes.STRING
        },
        functional: {
            type: DataTypes.BOOLEAN, // Matches tinyint(1)
            allowNull: false
        }
    },

    {
        tableName: 'Hardware'
    }
)

module.exports = Hardware;