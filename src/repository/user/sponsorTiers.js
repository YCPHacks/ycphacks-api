const {DataTypes} = require("sequelize");
const sequelize = require('../config/index');
const eventSponsor = sequelize.define(
    'eventSponsor',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        tier: {
            type: DataTypes.CHAR,
            allowNull: false,
            require: true,
            unique: true
        },
        lower_threshold: {
            type: DataTypes.INTEGER,
            allowNull: false,
            require: true,
            unique: true
        }
    }
)