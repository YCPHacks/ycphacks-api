const { sequelize, DataTypes } = require('./index'); // Sequelize instance

// Import all models (factory-defined)
const User = require('../user/User');
const Event = require('../event/Event');
const EventParticipant = require('../event/EventParticipants');
const Sponsor = require('../sponsor/Sponsor');
const SponsorTier = require('../sponsor/sponsorTiers');
const EventSponsor = require('../sponsor/EventSponsor');
//const Hardware = require('../hardware/Hardware');
//const HardwareImage = require('../hardware/HardwareImage');
//const Team = require('../team/Team');
//const HackCategory = require('../hackCategory/HackCategory');
//const Prize = require('../prize/Prize');
//const Analytics = require('../analytics/Analytics');
const Image = require('../image/Image');
const Activities = require('../event/Activities');

// ==========================
// Associations
// ==========================
//console.log('SponsorTier:', SponsorTier instanceof require('sequelize').Model);
//console.log('EventSponsor:', EventSponsor instanceof require('sequelize').Model);
//
//// Sponsor → EventSponsor
//Sponsor.hasMany(EventSponsor, { foreignKey: 'sponsorId', as: 'eventSponsors' });
//EventSponsor.belongsTo(Sponsor, { foreignKey: 'sponsorId', as: 'sponsor' });
//
//// EventSponsor → SponsorTier
//SponsorTier.hasMany(EventSponsor, { foreignKey: 'sponsorTierId', as: 'eventSponsors' });
//EventSponsor.belongsTo(SponsorTier, { foreignKey: 'sponsorTierId', as: 'tier' });

// Sponsor images
//Sponsor.belongsTo(Image, { foreignKey: 'sponsor_image_id', targetKey: 'id', as: 'image' });

// The rest of the associations are commented out for future use

// EventSponsors other sides
// Event.hasMany(EventSponsor, { foreignKey: 'event_id', as: 'eventSponsors' });
// EventSponsor.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });
// SponsorTier.hasMany(EventSponsor, { foreignKey: 'sponsor_tier_id', as: 'eventSponsors' });
// EventSponsor.belongsTo(SponsorTier, { foreignKey: 'sponsor_tier_id', as: 'tier' });

// Hardware / HardwareImage
// Hardware.hasMany(HardwareImage, { foreignKey: 'hardware_id', as: 'images' });
// HardwareImage.belongsTo(Hardware, { foreignKey: 'hardware_id', as: 'hardware' });

// EventParticipants
// User.hasMany(EventParticipant, { foreignKey: 'user_id', as: 'eventParticipants' });
// EventParticipant.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
// Event.hasMany(EventParticipant, { foreignKey: 'event_id', as: 'participants' });
// EventParticipant.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });
// Team.hasMany(EventParticipant, { foreignKey: 'team_id', as: 'participants' });
// EventParticipant.belongsTo(Team, { foreignKey: 'team_id', as: 'team' });

// Hack Categories / Prizes
// Event.hasMany(HackCategory, { foreignKey: 'event_id', as: 'categories' });
// HackCategory.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });
// HackCategory.hasMany(Prize, { foreignKey: 'category_id', as: 'prizes' });
// Prize.belongsTo(HackCategory, { foreignKey: 'category_id', as: 'category' });
// Event.hasMany(Prize, { foreignKey: 'event_id', as: 'prizes' });
// Prize.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });

// Users / Analytics
// User.hasMany(Analytics, { foreignKey: 'gender', sourceKey: 'gender', as: 'analyticsByGender' });
// User.hasMany(Analytics, { foreignKey: 'country', sourceKey: 'country', as: 'analyticsByCountry' });
// User.hasMany(Analytics, { foreignKey: 'school', sourceKey: 'school', as: 'analyticsBySchool' });
// User.hasMany(Analytics, { foreignKey: 'hackathons_attended', sourceKey: 'hackathons_attended', as: 'analyticsByHackathons' });
// Analytics.belongsTo(Event, { foreignKey: 'year', targetKey: 'year', as: 'event' });

// Hardware ownership
// User.hasMany(Hardware, { foreignKey: 'who_has_id', as: 'hardware' });
// Hardware.belongsTo(User, { foreignKey: 'who_has_id', as: 'owner' });

// Activities / Events
// Activities.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });
// Event.hasMany(Activities, { foreignKey: 'event_id', as: 'activities' });

// Event / Teams
// Event.hasMany(Team, { foreignKey: 'event_id', as: 'teams' });
// Team.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });

// Export models
module.exports = {
    sequelize,
    User,
    Event,
    EventParticipant,
    Sponsor,
    SponsorTier,
    EventSponsor,
    Image,
    Activities,
};

// Hardware,
//      HardwareImage,
//      Team,
//      HackCategory,
//      Prize,
//      Analytics,