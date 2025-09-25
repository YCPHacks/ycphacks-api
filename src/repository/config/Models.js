const User = require("../user/User");
const Event = require("../event/Event");
const EventParticipants = require('../event/EventParticipants');
const StaffRoles = require('../user/StaffRoles');
const Sponsor = require('../sponsor/Sponsor');
const SponsorTiers = require('../sponsor/sponsorTiers');
const EventSponsor = require('../sponsor/eventSponsor');
const Image = require('../image/Image');
const Activities = require('../event/Activities');
const Hardware = require('../hardware/Hardware');

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
    Activities,
    Hardware
};
module.exports = models;