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
    async updateSponsor(req, res) {
      try {
        const sponsorId = req.params.id;
        const { sponsorName, sponsorWebsite, image, sponsorTierId, eventId } = req.body;

        // If sponsorTierId + eventId are provided, update EventSponsor instead
        if (sponsorTierId && eventId) {
          const eventSponsor = await EventSponsor.findOne({
            where: { sponsorId, eventId }
          });

          if (!eventSponsor) {
            return res.status(404).json({ message: "EventSponsor not found" });
          }

          await eventSponsor.update({ sponsorTierId });
          return res.json(eventSponsor);
        }

        // Otherwise, update the Sponsor itself
        const sponsor = await Sponsor.findByPk(sponsorId);
        if (!sponsor) {
          return res.status(404).json({ message: "Sponsor not found" });
        }

        await sponsor.update({ sponsorName, sponsorWebsite, sponsorImageId: image });
        return res.json(sponsor);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating sponsor" });
      }
    }

    async updateSponsorBySponsorId(sponsorId, updates) {
      // console.log("Repo Method Called, sponsorId:", sponsorId);

      const eventSponsor = await EventSponsor.findOne({
        where: { sponsorId },
        include: [Sponsor, SponsorTier]
      });
      if (!eventSponsor) throw new Error("EventSponsor record not found");

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
      async removeSponsorFromEvent(eventSponsorId) {
          return await EventSponsor.destroy({ where: { id: eventSponsorId } });
      }

    // Gets Sponsor Tiers
    async getSponsorTier(){
      return await SponsorTier.findAll({
        attributes: ["id", "tier"]
      });
    }
  
}

module.exports = new EventSponsorRepo();