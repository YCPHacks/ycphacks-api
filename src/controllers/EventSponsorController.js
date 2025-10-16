const EventSponsorRepo = require("../repository/sponsor/EventSponsorRepo");
const SponsorRepo = require("../repository/sponsor/SponsorRepo");

class EventSponsorController {
//    Get all sponsors for a specific event
    static async getEventSponsors(req, res) {
      try {
        const { eventId } = req.query;
        if (!eventId) return res.status(400).json({ error: "eventId required" });

        const sponsorsRaw = await EventSponsorRepo.getSponsorsByEvent(eventId);

        const sponsors = sponsorsRaw.map(s => {
          const eventSponsor = s.EventSponsors?.[0]; // might be undefined
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

    static async getSponsorsByEvent(req, res){
      try{
        const eventId = req.params.eventId;
        const sponsorsRaw = await EventSponsorRepo.getSponsorsByEvent(eventId); 

        if(!sponsorsRaw) return res.json([]);

        const sponsors = sponsorsRaw.map(s => {
          const eventSponsor = s.EventSponsors?.[0];
          return {
            id: s.id,
            name: s.sponsorName,
            website: s.sponsorWebsite,
            image: s.sponsorImageId || "",
            sponsorTierId: eventSponsor?.sponsorTierId
          };
        });

        return res.json(sponsors);
      }catch(err){
        console.error("Error in getSponsorsByEvent: ", err);
        return res.status(500).json({ error: err.message });
      }
    }

//    Add sponsor to an event
    static async addSponsorToEvent(req, res){
        try {
          const { sponsorName, sponsorWebsite, image, sponsorTierId, eventId } = req.body;

          // FIX: Add validation check to return 400 for missing required fields
          if (!eventId || !sponsorName) {
              return res.status(400).json({ error: "Missing required fields: eventId and sponsorName are required." });
          }

          const result = await EventSponsorRepo.addSponsorToEvent(eventId, {
            sponsorName,
            sponsorWebsite,
            image,
            sponsorTierId
          });

          res.status(201).json({ result });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: "Failed to add sponsor to event" });
        }
    }

//    Update sponsor's info for this event
    static async updateEventSponsor(req, res){
        try{
            const sponsorId = req.params.id;
            const updates = req.body;

            const updated = await EventSponsorRepo.updateSponsorBySponsorId(sponsorId, updates);
            
            // FIX: Check for resource not found and return 404
            if (!updated) {
                return res.status(404).json({ error: "Sponsor not found or could not be updated." });
            }

            res.json(updated);
        }catch (err){
            // FIX: Using 500 for general server/database errors during update
            res.status(500).json({ error: err.message });
        }
    }

//    Remove sponsor from event
    static async removeEventSponsor(req, res) {
        try {
          const { id: sponsorId } = req.params;
          const { eventId } = req.query;

          if(!sponsorId || !eventId){
            return res.status(400).json({ error: "Missing sponsorId or eventId" });
          }

          const deleted = await EventSponsorRepo.removeSponsorFromEvent(sponsorId, eventId);

          if(deleted > 0){
            const sponsorDeleted = await SponsorRepo.deleteSponsorById(sponsorId);

            if(sponsorDeleted > 0){
              return res.status(204).end();
            }
            return res.status(204).end();
          }

          return res.status(404).json({ error: "Sponsor not associated with this event." });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: "Failed to remove sponsor from event" });
        }
    }

    static async getSponsorTiers(req, res){
      try{
        const tiers = await EventSponsorRepo.getSponsorTiers();

        if(!tiers || tiers.length === 0){
          return res.status(404).json({ error: "No sponsor tiers found" });
        }

        res.json(tiers);
      }catch(err){
        res.status(500).json({ error: "Failed to fetch sponsor tiers" });
      }
    }

    static async addSponsorTier(req, res){
        try{
            // Add imageWidth and imageHeight after it's set up in DB
            const { tier, lowerThreshold } = req.body;

            //  || !imageWidth || !imageHeight
            if (!tier || lowerThreshold === undefined) {
                return res.status(400).json({ error: "Missing required fields: tier or lowerThreshold." });
            }

            if (isNaN(Number(lowerThreshold)) || Number(lowerThreshold) < 0) {
                return res.status(400).json({ error: "lowerThreshold must be a non-negative number." });
            }
            // if (isNaN(Number(imageWidth)) || isNaN(Number(imageHeight))) {
            //     return res.status(400).json({ error: "imageWidth and imageHeight must be numbers." });
            // }

            // console.log("mmmm, sending to repo file now...");
            
            const newTier = await EventSponsorRepo.addSponsorTier({
                tier,
                lowerThreshold: Number(lowerThreshold),
            });
                // imageWidth: Number(imageWidth),
                // imageHeight: Number(imageHeight)
            return res.status(201).json(newTier);
        }catch(err){
            return res.status(500).json({ error: "Failed to create sponsor tier." });
        }
    }

    static async removeSponsorTier(req, res) {
        try {
          const { id: tierId } = req.params;

          if(!tierId){
            return res.status(400).json({ error: "Missing tierId" });
          }

//           console.log("Attempting to delete tier ID:", tierId); 
          const deletedCount = await EventSponsorRepo.removeSponsorTier(tierId);
        //   console.log("Rows deleted:", deletedCount);

          if(deletedCount === 0){
            return res.status(404).json({ error: "Sponsor Tier doesn't exist" });
          }

          return res.status(204).end();
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: "Failed to remove sponsor tier" });
        }
    }
}

module.exports = EventSponsorController;
