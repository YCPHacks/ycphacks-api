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
        model: SponsorTier,   // 🔥 fix: point to SponsorTier
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

module.exports = EventSponsor;