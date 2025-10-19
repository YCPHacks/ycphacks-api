const EventSponsor = require("./EventSponsor");
const SponsorRepo = require("./SponsorRepo");
const Sponsor = require("./Sponsor");
const SponsorTier = require("./SponsorTier");

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
    async addSponsorToEvent(eventId, sponsorData){
        const sponsor = await SponsorRepo.createSponsor({
          sponsorName: sponsorData.sponsorName,
          sponsorWebsite: sponsorData.sponsorWebsite,
          sponsorImageId: sponsorData.image || null
        });

        const eventSponsor = await EventSponsor.create({
          eventId,
          sponsorId: sponsor.id,
          sponsorTierId: sponsorData.sponsorTierId
        });

        return { sponsor, eventSponsor };
    }

//  Update Sponsor details + tier
    async updateSponsorBySponsorId(sponsorId, updates) {
      // console.log("Repo Method Called, sponsorId:", sponsorId);

      const eventSponsor = await EventSponsor.findOne({
        where: { sponsorId },
        include: [Sponsor, SponsorTier]
      });
      if (!eventSponsor) throw new Error("Event Sponsor record not found");

      const sponsor = await Sponsor.findByPk(sponsorId);
      if (sponsor) {
        if (updates.sponsorName) sponsor.sponsorName = updates.sponsorName;
        if (updates.sponsorWebsite) sponsor.sponsorWebsite = updates.sponsorWebsite;
        if ('image' in updates) sponsor.image = updates.image;
        await sponsor.save();
      }

      if ('sponsorTierId' in updates) {
        eventSponsor.sponsorTierId = updates.sponsorTierId;
        await eventSponsor.save();
      }

      // console.log("Data updated");

      const updatedRecord = await EventSponsor.findOne({
        where: { sponsorId },
        include: [Sponsor, SponsorTier]
      });

      // console.log("Updated record: ", JSON.stringify(updatedRecord, null, 2));

      return updatedRecord;

    }


  //  Remove sponsor from event
      async removeSponsorFromEvent(sponsorId, eventId) {
          return EventSponsor.destroy({ 
            where: { 
              sponsorId: sponsorId,
              eventId: eventId
            } 
          });
      }

    // Gets Sponsor Tiers
    async getSponsorTiers(){
      return await SponsorTier.findAll({
        attributes: ["id", "tier", "lowerThreshold", 'width', 'height'],
        order: [
          ['lowerThreshold', 'ASC']
        ]
      });
    }

  // Add Sponsor Tiers
  async addSponsorTier(tierData){
    return await SponsorTier.create({
      tier: tierData.tier,
      lowerThreshold: tierData.lowerThreshold,
      width: tierData.imageWidth,
      height: tierData.imageHeight,
    });
  }

  async updateSponsorTier(tierId, updates){
    const tier = await SponsorTier.findByPk(tierId);

    if(!tier){
      throw new Error(`Sponsor Tier with ID ${tierId} not found.`);
    }

    if ('tier' in updates && updates.tier !== null) {
      tier.tier = updates.tier;
    }
    
    if ('lowerThreshold' in updates && updates.lowerThreshold !== null && updates.lowerThreshold !== undefined) {
      tier.lowerThreshold = Number(updates.lowerThreshold); 
    }

    if ('width' in updates && updates.width !== null && updates.width !== undefined) {
        tier.width = Number(updates.width); 
    }

    if ('height' in updates && updates.height !== null && updates.height !== undefined) {
        tier.height = Number(updates.height);
    }

    await tier.save();
    return tier;
  }

  async removeSponsorTier(tierId){
    return SponsorTier.destroy({
      where: {
        id: tierId
      }
    });
  }
  
}

module.exports = new EventSponsorRepo();