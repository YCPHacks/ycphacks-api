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

/* EVENT ASSOCIATIONS */

// Event <---> EventParticipant
Event.hasMany(EventParticipant, {
    foreignKey: 'eventId',
    onDelete: 'CASCADE',
});
EventParticipant.belongsTo(Event, {
    foreignKey: 'eventId',
    onDelete: 'CASCADE',
});

// Event <---> EventSponsor
Event.hasMany(EventSponsor, {
    foreignKey: 'eventId',
    onDelete: 'CASCADE',
});
EventSponsor.belongsTo(Event, {
    foreignKey: 'eventId',
    onDelete: 'CASCADE',
});

// Event <---> Activity
Event.hasMany(Activity, {
    foreignKey: 'eventId',
    onDelete: 'CASCADE',
});
Activity.belongsTo(Event, {
    foreignKey: 'eventId',
    onDelete: 'CASCADE',
});

// Event <---> Prize
Event.hasMany(Prize, {
    foreignKey: 'eventId',
    onDelete: 'CASCADE',
});
Prize.belongsTo(Event, {
    foreignKey: 'eventId',
    onDelete: 'CASCADE',
});

// Event <---> Team
Event.hasMany(Team, {
    foreignKey: 'eventId',
    onDelete: 'CASCADE',
});
Team.belongsTo(Event, {
    foreignKey: 'eventId',
    onDelete: 'CASCADE',
});

// Event <---> HackCategory
Event.hasMany(HackCategory, {
    foreignKey: 'eventId',
    onDelete: 'CASCADE',
});
HackCategory.belongsTo(Event, {
    foreignKey: 'eventId',
    onDelete: 'CASCADE',
});

Team.hasMany(EventParticipant, { foreignKey: 'teamId' });
EventParticipant.belongsTo(Team, { foreignKey: 'teamId' });

EventParticipant.belongsTo(User, { foreignKey: 'userId', as: 'userDetails' });
User.hasMany(EventParticipant, { foreignKey: 'userId' });

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
    HardwareImage
};
