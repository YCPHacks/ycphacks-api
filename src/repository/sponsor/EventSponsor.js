const {DataTypes} = require("sequelize");
const sequelize = require('../config');
const EventSponsor = sequelize.define(
    'EventSponsor',
    {
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Event',
                key: 'id'
            }
        },
        sponsorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Sponsor',
                key: 'id'
            }
        },
        sponsorTierId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Sponsor',
                key: 'id'
            }
        },
        sponsorAmount: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        }
    }
)

module.exports = EventSponsor;