const { DataTypes } = require('sequelize');
const sequelize = require('../config');

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
            type: DataTypes.STRING,
            allowNull: false,
            require: true
        },
        sponsor_website: {
            type: DataTypes.STRING,
            allowNull: false,
            require: true
        },
    },
    {
        paranoid: true
    }

);

module.exports = Sponsor;