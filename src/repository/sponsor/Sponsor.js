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
<<<<<<< Updated upstream
            type: DataTypes.STRING,
            allowNull: false,
            field: 'sponsorWebsite'
        },
        sponsorImageId: {
            type: DataTypes.INTEGER,
=======
<<<<<<< HEAD
            type: DataTypes.STRING
        },
        sponsorImageId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Image',
                key: 'id'
            }
=======
            type: DataTypes.STRING,
            allowNull: false,
            field: 'sponsorWebsite'
        },
        sponsorImageId: {
            type: DataTypes.INTEGER,
>>>>>>> Stashed changes
            field: 'sponsorImageId'
        },
        tierId: {
            type: DataTypes.INTEGER,
            field: 'tierId'
<<<<<<< Updated upstream
=======
>>>>>>> sponsors
>>>>>>> Stashed changes
        }
    },
    {
        tableName: 'Sponsor',
        paranoid: true
    }
);

module.exports = Sponsor;