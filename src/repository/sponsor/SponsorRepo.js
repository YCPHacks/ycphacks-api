const Sponsor = require("Sponsor");
const EventSponsor = require("ycphacks-api/src/repository/sponsor/EventSponsor")
const SponsorTier = require("ycphacks-api/src/repository/sponsor/SponsorTier")
const Image = require("../image/Image")

const SponsorRepo = {
    //Sponsor
    async findSponsorById(id){
        return Sponsor.findOne({
            where: { id },
            include: {model: Image}
        });
    },
    async findAllSponsors(){
        return Sponsor.findAll({
            include: {model: Image}
        });
    },
    async createSponsor(sponsor){
        return Sponsor.create(sponsor);
    },

    //EventSponsor
    async findEventSponsorsById(id){
        return EventSponsor.findAll({
            where: { id },
            include: [{model: Sponsor, include: {model: Image}}, {model: SponsorTier}]
        });
    },
    async findEventSponsorsByEvent(eventId){
        return EventSponsor.findAll({
            where: {event_id: eventId},
            include: [{model: Sponsor, include: {model: Image}}, {model: SponsorTiers}]
        });
    },
    async createEventSponsor(eventSponsor){
        return EventSponsor.create(eventSponsor);
    },

    //SponsorTier
    async createSponsorTier(sponsorTier){
        return SponsorTier.create(sponsorTier);
    },
    async deleteSponsorTierById(id){
        return SponsorTier.destroy({
            where: { id }
        });
    },
    async getAllSponsorTiers(){
        return SponsorTier.findAll({});
    }
}