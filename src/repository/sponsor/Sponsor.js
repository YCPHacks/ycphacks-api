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
        sponsorName: {
            type: DataTypes.STRING,
            allowNull: false,
            require: true
        },
        sponsorWebsite: {
            type: DataTypes.STRING
        },
        sponsorImageId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Image',
                key: 'id'
            }
        }
    },
    {
        tableName: 'Sponsor',
        paranoid: true
    }

);

module.exports = Sponsor;