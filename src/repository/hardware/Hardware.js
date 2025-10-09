const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/index');

const Hardware = sequelize.define(
    'Hardware',
    {
        id : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        hardwareName : {
            type: DataTypes.STRING(100),
            allowNull: false,
            require: true
        },
        serial : {
            type: DataTypes.STRING(255),
            allowNull: false,
            require: true
        },
        whoHasId : {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        description : {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        functional : {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        createdAt : {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt : {
            type: DataTypes.DATE,
            allowNull: false
        }
    }
);

module.exports = Hardware;