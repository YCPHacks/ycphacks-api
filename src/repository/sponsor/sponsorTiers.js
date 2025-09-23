const { DataTypes } = require("sequelize");
const { sequelize } = require('../config');

const sponsorTiers = sequelize.define(
    'SponsorTier',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        tier: {
            type: DataTypes.CHAR,
            allowNull: false,
            require: true,
        },
        lower_threshold: {
            type: DataTypes.INTEGER,
            allowNull: false,
            require: true,
        }
    },
    {
        tableName: 'SponsorTier',
        timestamps: false
    }
);

module.exports = sponsorTiers;