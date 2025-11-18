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
            references: {
                model: 'Image',
                key: 'id'
            },
            field: 'sponsorImageId'
        },
        amount: {
            type: DataTypes.INTEGER,
            field: 'amount',
            allowNull: false,
            required: true
        }
    },
    {
        tableName: 'Sponsor',
        paranoid: true
    }
);

module.exports = Sponsor;