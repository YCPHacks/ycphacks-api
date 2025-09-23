const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/index.js');

const Sponsor = sequelize.define(
    'Sponsor',
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
        tableName: 'Sponsor',
        paranoid: true
    }
);

module.exports = Sponsor;