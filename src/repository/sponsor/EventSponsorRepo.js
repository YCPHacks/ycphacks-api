const EventSponsor = require("./EventSponsor");
const SponsorRepo = require("./SponsorRepo");
const Sponsor = require("./Sponsor");
const SponsorTier = require("./sponsorTiers");

class EventSponsorRepo {
//    Get all sponsors for a given event
    async getSponsorsByEvent(eventId) {
      return await Sponsor.findAll({
        include: [
          {
            model: EventSponsor,
            where: { eventId },
            required: false, // LEFT JOIN so sponsors without an EventSponsor row are included
            include: [
              {
                model: SponsorTier,
                attributes: ["id", "tier"],
                required: false
              }
            ]
          }
        ],
        attributes: ["id", "sponsorName", "sponsorWebsite", "sponsorImageId"]
      });
    }

//    Add a sponsor to an event with a tier
    async addSponsorToEvent(eventId, sponsorId, sponsorTierId){
        return await EventSponsor.create({ eventId, sponsorId, sponsorTierId });
    }

//  Update Sponsor details + tier
    async updateSponsor(eventSponsorId, updates) {
        const eventSponsor = await EventSponsor.findByPk(eventSponsorId, {
          include: [Sponsor, SponsorTier]
        });
        if (!eventSponsor) throw new Error("EventSponsor record not found");

        // Update Sponsor info (name, website, image)
        if (updates.sponsorName || updates.sponsorWebsite || updates.image) {
          const sponsor = await Sponsor.findByPk(eventSponsor.sponsorId);
          if (sponsor) {
            if (updates.sponsorName) sponsor.sponsorName = updates.sponsorName;
            if (updates.sponsorWebsite) sponsor.sponsorWebsite = updates.sponsorWebsite;
            if (updates.image) sponsor.image = updates.image; // assuming image is a URL string
            await sponsor.save();
          }
        }

        // Update Sponsor Tier
        if (updates.sponsorTierId) {
          eventSponsor.sponsorTierId = updates.sponsorTierId;
          await eventSponsor.save();
        }

        return await EventSponsor.findByPk(eventSponsorId, {
          include: [Sponsor, SponsorTier]
        });
    }

//  Remove sponsor from event
    async removeSponsorFromEvent(eventSponsorId) {
        return await EventSponsor.destroy({ where: { id: eventSponsorId } });
    }
}

module.exports = new EventSponsorRepo();