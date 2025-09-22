const { DataTypes } = require('sequelize');
const sequelize = require('../config');

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'Sponsors',
        {
            id : {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            sponsorName: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'sponsorName'
            },
            sponsorWebsite: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'sponsorWebsite'
            },
            sponsorImageId: {
                type: DataTypes.INTEGER,
                field: 'sponsorImageId'
            },
            tierId: {
                type: DataTypes.INTEGER,
                field: 'tierId'
            }
        },
        {
            tableName: 'Sponsors',
            paranoid: true
        }
    );
};