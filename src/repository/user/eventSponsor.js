const {DataTypes} = require("sequelize");
const sequelize = require('../config/index');
const eventSponsor = sequelize.define(
    'eventSponsor',
    {
        sponsor_tier: {
            type: DataTypes.CHAR,
            allowNull: false,
            require: true
        },
        sponsor_amount: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            require: true
        },
        event_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sponsor_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }
)