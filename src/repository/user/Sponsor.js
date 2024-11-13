const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

const Sponsor = sequelize.define(
    'Sponsor',
    {
        id : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        sponsor_name: {
            type: DataTypes.STRING(100), //todo: determine length for sponsor_name
            unique: true,
            allowNull: false,
            require: true
        },
        sponsor_website: {
            type: DataTypes.STRING(100), //todo: determine max length for sponsor_website
            allowNull: false,
            require: true
        },
        image_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        event_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }

    },
    {
        paranoid: true
    }

)