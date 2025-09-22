const { DataTypes } = require('sequelize');
const sequelize = require('../config');

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
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
};