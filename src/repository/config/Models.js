const sequelize = require('./index'); // your Sequelize instance
const { DataTypes } = require('sequelize');

const User = require("../user/User");
const Event = require("../event/Event");
const EventParticipants = require('../event/EventParticipants');
const Sponsor = require('../sponsor/Sponsor');
const SponsorTiers = require('../sponsor/sponsorTiers');
const EventSponsor = require('../sponsor/eventSponsor');
const Image = require('../image/Image');
const Activities = require('../event/Activities');

// add all new Sequelize models here
const models = {
    User,
    Event,
    EventParticipants,
    Sponsor,
    SponsorTiers,
    EventSponsor,
    Image,
    Activities
};
module.exports = models;