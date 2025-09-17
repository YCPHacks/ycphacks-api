const User = require("../user/User");
const StaffRoles = require('../user/StaffRoles');
const Event = require('../event/Event');
const EventParticipant = require('../event/EventParticipant');
const HackCategory = require('../event/HackCategory');
const Prize = require('../event/Prize');
const Sponsor = require('../sponsor/Sponsor');
const SponsorTiers = require('../sponsor/sponsorTiers');
const EventSponsor = require('../sponsor/EventSponsor');
const Image = require('../image/Image');
const Activities = require('../event/Activities');

// Associations
Prize.belongsTo(Event, { foreignKey: 'eventId', onDelete: 'CASCADE' });
Prize.belongsTo(HackCategory, { foreignKey: 'categoryId', onDelete: 'SET NULL' });

Event.hasMany(Prize, { foreignKey: 'eventId' });
HackCategory.hasMany(Prize, { foreignKey: 'categoryId' });

// add all new Sequelize models here
const models = {
    User,
    StaffRoles,
    Event,
    EventParticipant,
    HackCategory,
    Prize,
    Sponsor,
    SponsorTiers,
    EventSponsor,
    Image,
    Activities
};
module.exports = models;