const EventSponsorRepoModel = require('../repository/sponsor/EventSponsorRepo');
const EventSponsor = require("../models/eventSponsor");
const SponsorTiersRepoModel = require("../repository/sponsor/sponsorTiers");
const SponsorTiers = require("../models/sponsorTiers");
const SponsorRepo = require('../repository/sponsor/SponsorRepo');


/**
 * function creates a sponsor entry in table Sponsors
 * Return needs to be defined in dto
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const createSponsor = async (req, res) => {
    try {
        const createSponsorDto = req.body;

        const sponsor = await SponsorRepo.createSponsor({
            sponsor_name: createSponsorDto.sponsor_name,
            sponsor_website: createSponsorDto.sponsor_website,
            image_id: createSponsorDto.image_id || null
        });

        const validationErrors = sponsor.validate()
        if (validationErrors.length > 0) {
            return res.status(400).json({
                message: 'Validation errors occurred',
                errors: validationErrors
            });
        }

        const persistedSponsor = await SponsorRepo.create(sponsor);

        return res.status(201).json({
            message: 'Sponsor created successfully',
            event: persistedSponsor
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

/**
 * function creates a sponsorship entry in eventSponsors
 * Return needs to be defined in dto
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const createSponsorship = async (req, res) => {
    //todo
}

/**
 * function pulls a single sponsor from the database
 * Returns DTO
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getSponsorData = async (req, res) => {
    try{
        const { id } = req.params;
        const sponsor = await SponsorRepo.findSponsorById(id);

        if(!Sponsor){
            return res.status(404).json({ message: "Sponsor not found" });
        }

        const response = new SponsorResponseDto(sponsor);
        return res.status(200).json(response);
    }catch(err){
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const getAllSponsors = async (req, res) => {
    try{
        const sponsors = await SponsorRepo.findAllSponsors();
        const plainSponsors = sponsors.map(s => s.toJSON());
        console.log(plainSponsors);
        console.log(JSON.stringify(sponsors, null, 2));
        return res.status(200).json(plainSponsors);
    }catch(err){
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error "});
    }
}

/**
 * function pulls all sponsors for a given event with sponsorship data
 * return collection of sponsor data, need to define object
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getSponsorsByEvent = async (req, res) => {
    //todo
}

const updateSponsor = async (req, res) => {
  try {
    const sponsorId = req.params.id;
    const { sponsor_name, sponsor_website, image_id, tier } = req.body;

    const sponsor = await SponsorRepo.findSponsorById(sponsorId);
    if (!sponsor) return res.status(404).json({ message: "Sponsor not found" });

    sponsor.sponsor_name = sponsor_name;
    sponsor.sponsor_website = sponsor_website;
    sponsor.image_id = image_id;

    await sponsor.save();

    const response = new SponsorResponseDto(sponsor);
    return res.status(200).json({ message: "Sponsor updated successfully", sponsor: response });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteSponsor = async (req, res) => {
  try {
    const sponsorId = req.params.id;
    const deleted = await SponsorRepo.deleteSponsorById(sponsorId);
    if (!deleted) return res.status(404).json({ message: "Sponsor not found" });
    return res.status(200).json({ message: "Sponsor deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {createSponsor, getAllSponsors, getSponsorData, updateSponsor, deleteSponsor}