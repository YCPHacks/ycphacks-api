const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const Image = sequelize.define(
    'Sponsor',
    {
        id : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        url : {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {

    }

);

module.exports = Image;