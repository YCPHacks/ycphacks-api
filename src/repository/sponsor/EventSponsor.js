<<<<<<< Updated upstream
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config");
const Sponsor = require("./Sponsor");
const SponsorTier = require("./sponsorTiers");

=======
<<<<<<< HEAD
const {DataTypes} = require("sequelize");
const sequelize = require('../config');
>>>>>>> Stashed changes
const EventSponsor = sequelize.define(
  "EventSponsor",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sponsorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Sponsor,
        key: "id",
      },
    },
    sponsorTierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: SponsorTier,
        key: "id",
      },
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "EventSponsor",
    timestamps: false,
  }
);

// Associations
Sponsor.hasMany(EventSponsor, { foreignKey: "sponsorId" });
EventSponsor.belongsTo(Sponsor, { foreignKey: "sponsorId" });

<<<<<<< Updated upstream
SponsorTier.hasMany(EventSponsor, { foreignKey: "sponsorTierId" });
EventSponsor.belongsTo(SponsorTier, { foreignKey: "sponsorTierId" });
=======
    {
        tableName: 'EventSponsor'
    }
)
=======
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config");
const Sponsor = require("./Sponsor");
const SponsorTier = require("./sponsorTiers");

const EventSponsor = sequelize.define(
  "EventSponsor",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sponsorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Sponsor,
        key: "id",
      },
    },
    sponsorTierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: SponsorTier,
        key: "id",
      },
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "EventSponsor",
    timestamps: false,
  }
);

// Associations
Sponsor.hasMany(EventSponsor, { foreignKey: "sponsorId" });
EventSponsor.belongsTo(Sponsor, { foreignKey: "sponsorId" });

SponsorTier.hasMany(EventSponsor, { foreignKey: "sponsorTierId" });
EventSponsor.belongsTo(SponsorTier, { foreignKey: "sponsorTierId" });
>>>>>>> sponsors
>>>>>>> Stashed changes

module.exports = EventSponsor;