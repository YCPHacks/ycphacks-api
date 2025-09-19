const User = require("../user/User");
const Team = require('../team/Team');
const Event = require('../event/Event');
const EventParticipant = require('../event/EventParticipant');
const HackCategory = require('../event/HackCategory');
const Prize = require('../event/Prize');
const Sponsor = require('../sponsor/Sponsor');
const SponsorTiers = require('../sponsor/SponsorTier');
const EventSponsor = require('../sponsor/EventSponsor');
const Image = require('../image/Image');
const Analytics = require('../analytics/Analytics');
const Hardware = require('../hardware/Hardware');
const HardwareImage = require('../hardware/HardwareImage');

// Associations
Prize.belongsTo(Event, { foreignKey: 'eventId', onDelete: 'CASCADE' });
Prize.belongsTo(HackCategory, { foreignKey: 'categoryId', onDelete: 'SET NULL' });

Event.hasMany(Prize, { foreignKey: 'eventId' });
HackCategory.hasMany(Prize, { foreignKey: 'categoryId' });

// add all new Sequelize models here
const models = {
    User,
    Team,
    Event,
    EventParticipant,
    HackCategory,
    Prize,
    Sponsor,
    SponsorTiers,
    EventSponsor,
    Image,
    Analytics,
    Hardware,
    HardwareImage
};
module.exports = models;