const EventSponsorRepo = require("../repository/sponsor/EventSponsorRepo");

class EventSponsorController {
//    Get all sponsors for a specific event
    static async getEventSponsors(req, res) {
      try {
        const { eventId } = req.query;
        if (!eventId) return res.status(400).json({ error: "eventId required" });

        const sponsorsRaw = await EventSponsorRepo.getSponsorsByEvent(eventId);

        const sponsors = sponsorsRaw.map(s => {
          const eventSponsor = s.EventSponsors[0]; // might be undefined
          return {
            id: s.id,
            name: s.sponsorName,
            website: s.sponsorWebsite,
            image: s.sponsorImageId || "",
            tier: eventSponsor?.SponsorTier?.tier || "",
          };
        });

        const tiersSet = new Set();
        sponsorsRaw.forEach(s => {
          s.EventSponsors.forEach(es => {
            if (es.SponsorTier?.tier) tiersSet.add(es.SponsorTier.tier);
          });
        });
        const tiers = Array.from(tiersSet); // array of all tiers

        res.json({sponsors, tiers});
      } catch (err) {
        console.error("EventSponsor fetch error:", err);
        return res.status(500).json({ error: err.message });
      }
    }

//    Add sponsor to an event
    static async addSponsorToEvent(req, res){
        try {
          const { sponsorName, sponsorWebsite, image, sponsorTierId, eventId } = req.body;

          const result = await EventSponsorRepo.addSponsorToEvent(eventId, {
            sponsorName,
            sponsorWebsite,
            image,
            sponsorTierId
          });

          res.json({ result });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: "Failed to add sponsor to event" });
        }
    }

//    Update sponsor's info for this event
    static async updateEventSponsor(req, res){
        try{
            const { id } = req.params;
            const updates = req.body;
            const updated = await EventSponsorRepo.updateSponsor(id, updates);

            if(!updated){
                return res.status(404).json({ error: "EventSponsor not found" });
            }

            res.json(update);
        }catch (err){
            res.status(400).json({ error: err.message });
        }
    }

//    Remove sponsor from event
    static async removeEventSponsor(req, res) {
        try {
          const { eventSponsorId } = req.params;

          const deleted = await EventSponsorRepo.removeEventSponsor(eventSponsorId);

          if (!deleted) {
            return res.status(404).json({ error: "EventSponsor not found" });
          }

          res.json({ message: "Sponsor removed from event successfully" });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: "Failed to remove sponsor from event" });
        }
    }

    static async getSponsorTiers(req, res){
      try{
        const tiers = await EventSponsorRepo.getSponsorTier();

        if(!tiers || tiers.length === 0){
          return res.status(404).json({ error: "No sponsor tiers found" });
        }

        res.json(tiers);
      }catch(err){
        res.status(500).json({ error: "Failed to fetch sponsor tiers" });
      }
    }
}

module.exports = EventSponsorController;