const {DataTypes} = require("sequelize");
const { sequelize } = require('../config');

const eventSponsor = sequelize.define(
    'EventSponsor',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sponsorId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sponsorTierId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sponsorAmount: {
            type: DataTypes.DOUBLE,
            allowNull: false
        }
    }
);

module.exports = eventSponsor;