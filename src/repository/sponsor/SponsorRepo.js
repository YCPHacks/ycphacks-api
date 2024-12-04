const Sponsor = require("Sponsor");
const EventSponsor = require("eventSponsor")
const SponsorTiers = require("sponsorTiers")
const Image = require("../image/Image")

const SponsorRepo = {
    //sponsor
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

    //eventSponsor
    async findEventSponsorsById(id){
        return EventSponsor.findAll({
            where: { id },
            include: [{model: Sponsor, include: {model: Image}}, {model: SponsorTiers}]
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

    //sponsorTiers
    async createSponsorTier(sponsorTier){
        return SponsorTiers.create(sponsorTier);
    },
    async deleteSponsorTierById(id){
        return SponsorTiers.destroy({
            where: { id }
        });
    },
    async getAllSponsorTiers(){
        return SponsorTiers.findAll({});
    }
}