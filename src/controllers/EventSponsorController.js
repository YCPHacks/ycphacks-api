const EventSponsorRepo = require("../repository/sponsor/EventSponsorRepo");
const SponsorRepo = require("../repository/sponsor/SponsorRepo");

const setDefaultImageDimensions = (tierName) => {
    switch (tierName.toLowerCase()) {
        case 'Bronze':
            return { imageWidth: 50, imageHeight: 50 };
        case 'Silver':
            return { imageWidth: 100, imageHeight: 100 };
        case 'Gold':
            return { imageWidth: 150, imageHeight: 150 };
        case 'Platinum':
            return { imageWidth: 200, imageHeight: 200 };
        default:
            return { imageWidth: 0, imageHeight: 0 }; 
    }
};

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
            
            if (!updated) {
                return res.status(404).json({ error: "Sponsor not found or could not be updated." });
            }

            res.json(updated);
        }catch (err){
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
            const { tier, lowerThreshold, width, height } = req.body;
            
            let imageWidth = width;
            let imageHeight = height;

            if (!imageWidth && !imageHeight) {
                const defaults = setDefaultImageDimensions(tier);
                imageWidth = defaults.imageWidth;
                imageHeight = defaults.imageHeight;
            }

            if (!tier || lowerThreshold === undefined || !imageWidth || !imageHeight) {
                return res.status(400).json({ error: "Missing required fields: Tier Name, Lower Threshold, Width, or Height." });
            }

            if (isNaN(Number(lowerThreshold)) || Number(lowerThreshold) < 0) {
                return res.status(400).json({ error: "lowerThreshold must be a non-negative number." });
            }
            if (isNaN(Number(imageWidth)) || isNaN(Number(imageHeight))) {
                return res.status(400).json({ error: "imageWidth and imageHeight must be numbers." });
            }

            // console.log("mmmm, sending to repo file now...");
            
            const newTier = await EventSponsorRepo.addSponsorTier({
                tier,
                lowerThreshold: Number(lowerThreshold),
                imageWidth: Number(imageWidth),
                imageHeight: Number(imageHeight)
            });
            return res.status(201).json(newTier);
        }catch(err){
            console.error("GET Sponsor Tiers Failed: ", err);
            return res.status(500).json({ error: "Failed to create sponsor tier." });
        }
    }

    static async updateSponsorTier(req, res){
        try {
            const tierId = req.params.id;
            // Destructure all potential update fields, including the new ones
            let { tier, lowerThreshold, width, height } = req.body;
            
            // Prepare the updates object to send to the repository
            const updates = {};

            if (!width && !height) {
                const defaults = setDefaultImageDimensions(tier);
                width = defaults.imageWidth;
                height = defaults.imageHeight;
            }

            // --- 1. Validation and Assignment ---

            // Validate and assign 'tier'
            if (tier !== undefined) {
                updates.tier = tier;
            }

            // Validate and assign 'lowerThreshold'
            if (lowerThreshold !== undefined) {
                const threshold = Number(lowerThreshold);
                if (isNaN(threshold) || threshold < 0) {
                    return res.status(400).json({ error: "lowerThreshold must be a non-negative number." });
                }
                updates.lowerThreshold = threshold;
            }

            // Validate and assign 'imageWidth'
            if (width !== undefined) {
                const Parsedwidth = Number(width);
                if (isNaN(Parsedwidth)) {
                    return res.status(400).json({ error: "imageWidth must be a number." });
                }
                updates.width = Parsedwidth;
            }

            // Validate and assign 'imageHeight'
            if (height !== undefined) {
                const Parsedheight = Number(height);
                if (isNaN(Parsedheight)) {
                    return res.status(400).json({ error: "imageHeight must be a number." });
                }
                updates.height = Parsedheight;
            }

            // Check if no valid update fields were provided (optional, but good practice)
            if (Object.keys(updates).length === 0) {
                return res.status(400).json({ error: "No valid fields provided for update." });
            }

            // --- 2. Required Field Check (Revised) ---

            // Check if 'tier' and 'lowerThreshold' are explicitly being set to bad values if they exist in the body
            // Note: In a PATCH request like this, we only validate the fields that are sent.
            if ((lowerThreshold !== undefined && updates.lowerThreshold === undefined) || (tier !== undefined && updates.tier === undefined)) {
                // This case is covered by the specific validation checks above
            }

            // Ensure that if 'tier' or 'lowerThreshold' are being updated, they pass the basic validity check
            if ((updates.tier === "") || (updates.lowerThreshold !== undefined && updates.lowerThreshold < 0)) {
                return res.status(400).json({ error: "Invalid tier name or non-negative lower threshold required." });
            }

            // --- 3. Repository Call ---

            const updatedTier = await EventSponsorRepo.updateSponsorTier(tierId, updates);

            res.json(updatedTier);
        } catch (err) {
            console.error("Error updating sponsor tier:", err.message);
            
            if (err.message.includes("not found")) {
                return res.status(404).json({ error: err.message });
            }
            
            res.status(500).json({ error: err.message });
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
