const User = require("../user/User");
const StaffRoles = require('../user/StaffRoles');
const Event = require('../event/Event');
const EventParticipant = require('../event/EventParticipant');
const HackCategory = require('../event/HackCategory');
const Sponsor = require('../sponsor/Sponsor');
const SponsorTiers = require('../sponsor/sponsorTiers');
const EventSponsor = require('../sponsor/EventSponsor');
const Image = require('../image/Image');
const Activities = require('../event/Activities');

// add all new Sequelize models here
const models = {
    User,
    StaffRoles,
    Event,
    EventParticipant,
    HackCategory,
    Sponsor,
    SponsorTiers,
    EventSponsor,
    Image,
    Activities
};
module.exports = models;