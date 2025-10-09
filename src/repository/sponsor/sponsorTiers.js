<<<<<<< Updated upstream:src/repository/sponsor/sponsorTiers.js
=======
<<<<<<< HEAD:src/repository/sponsor/SponsorTier.js
const {DataTypes} = require("sequelize");
const sequelize = require('../config');
const SponsorTier = sequelize.define(
=======
>>>>>>> Stashed changes:src/repository/sponsor/SponsorTier.js
const { DataTypes } = require("sequelize");
const { sequelize } = require('../config');

const sponsorTiers = sequelize.define(
<<<<<<< Updated upstream:src/repository/sponsor/sponsorTiers.js
=======
>>>>>>> sponsors:src/repository/sponsor/sponsorTiers.js
>>>>>>> Stashed changes:src/repository/sponsor/SponsorTier.js
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
        }
    },
<<<<<<< Updated upstream:src/repository/sponsor/sponsorTiers.js
    {
        tableName: 'SponsorTier',
        timestamps: false,
    }
);

module.exports = sponsorTiers;
=======
<<<<<<< HEAD:src/repository/sponsor/SponsorTier.js

    {
        tableName: 'SponsorTier'
=======
    {
        tableName: 'SponsorTier',
        timestamps: false,
>>>>>>> sponsors:src/repository/sponsor/sponsorTiers.js
    }
);

<<<<<<< HEAD:src/repository/sponsor/SponsorTier.js
module.exports = SponsorTier;
=======
module.exports = sponsorTiers;
>>>>>>> sponsors:src/repository/sponsor/sponsorTiers.js
>>>>>>> Stashed changes:src/repository/sponsor/SponsorTier.js
