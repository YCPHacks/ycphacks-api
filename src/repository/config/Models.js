const User = require("../user/User");
const Event = require("../event/Event");
const EventParticipants = require('../event/EventParticipants');
const StaffRoles = require('../user/StaffRoles');
const models = {
    User,
    Event,
    EventParticipants,
    StaffRoles,
};

module.exports = models;