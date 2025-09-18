const SponsorRepoModel = require('../repository/sponsor/Sponsor');
const Sponsor = require('../models/Sponsor');
const EventSponsorRepoModel = require('../repository/sponsor/EventSponsor');
const EventSponsor = require("../models/EventSponsor");
const SponsorTierRepoModel = require("../repository/sponsor/SponsorTier");
const SponsorTier = require("../models/SponsorTier");
const CreateSponsor = require("../models/CreateSponsor");


/**
 * function creates a sponsor entry in table Sponsor
 * Return needs to be defined in dto
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const createSponsor = async (req, res) => {
    try {
        const createSponsorDto = req.body;

        const sponsor = new CreateSponsor(
            sponsorName = createSponsorDto.sponsorName,
            sponsorWebsite = createSponsorDto.sponsorWebsite,
            sponsorImageId = createSponsorDto.sponsorImageId
        )

        const validationErrors = sponsor.validate()
        if (validationErrors.length > 0) {
            return res.status(400).json({
                message: 'Validation errors occurred',
                errors: validationErrors
            });
        }

        const persistedSponsor = await SponsorRepoModel.create(sponsor);

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
 * function creates a sponsorship entry in EventSponsor
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
    //todo
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