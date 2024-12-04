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
module.exports = models;