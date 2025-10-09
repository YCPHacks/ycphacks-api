const { sequelize, DataTypes } = require('./index'); // Sequelize instance

// Import all models (factory-defined)
const User = require('../user/User');
const Event = require('../event/Event');
const EventParticipant = require('../event/EventParticipant');
const Sponsor = require('../sponsor/Sponsor');
const SponsorTier = require('../sponsor/SponsorTier');
const EventSponsor = require('../sponsor/EventSponsor');
const Hardware = require('../hardware/Hardware');
const HardwareImage = require('../hardware/HardwareImage');
const Team = require('../team/Team');
const HackCategory = require('../event/HackCategory');
const Prize = require('../event/Prize');
const Analytics = require('../analytics/Analytics');

const Image = require('../image/Image');
const Activity = require('../event/Activity');

// Export models
module.exports = {
    sequelize,
    User,
    Team,
    Event,
    Activity,
    EventParticipant,
    HackCategory,
    Prize,
    Sponsor,
    SponsorTier,
    EventSponsor,
    Image,
    Analytics,
    Hardware,
    HardwareImage,
    Team
};
