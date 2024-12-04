const User = require("../user/User");
const Event = require("../event/Event");
const EventParticipants = require('../event/EventParticipants');
const StaffRoles = require('../user/StaffRoles');
const Sponsor = require('../sponsor/Sponsor');
const SponsorTiers = require('../sponsor/sponsorTiers');
const EventSponsor = require('../sponsor/eventSponsor');
const Image = require('../image/Image');

// add all new Sequelize models here
const models = {
    User,
    Event,
    EventParticipants,
    StaffRoles,
    Sponsor,
    SponsorTiers,
    EventSponsor,
    Image,
};

// defining relationships
User.hasMany(EventParticipants, {});
EventParticipants.belongsTo(User, {foreignKey: {name: "user_id"}});

Event.hasMany(EventParticipants, {});
EventParticipants.belongsTo(Event, {foreignKey: {name: "event_id"}});

Sponsor.hasMany(EventSponsor, {});
EventSponsor.belongsTo(Sponsor, {foreignKey: {name: "sponsor_id"}});

Event.hasMany(EventSponsor, {});
EventSponsor.belongsTo(Event, {foreignKey: {name: "event_id"}});

SponsorTiers.hasMany(Sponsor, {});
EventSponsor.belongsTo(SponsorTiers, {foreignKey: {name: "sponsor_tier_id"}});

Sponsor.belongsTo(Image, {foreignKey: {name: 'sponsor_image_id'}});

module.exports = models;