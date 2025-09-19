const {DataTypes} = require("sequelize");
const sequelize = require('../config');
const SponsorTier = sequelize.define(
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
        lowerThreshold: {
            type: DataTypes.INTEGER,
            allowNull: false,
            require: true,
        }
    },

    {
        tableName: 'SponsorTier'
    }
)

module.exports = SponsorTier;