const HardwareRepo = require('../repository/hardware/HardwareRepo');
const Hardware = require('../models/Hardware');
const EventRepo = require("../repository/event/EventRepo");
const {Readable} = require("stream");
const csv = require("csv-parser");


const HardwareController = {
    async getHardwareById(req, res) {
        try{
            const hardware = await HardwareRepo.findHardwareById(req.params.id);
            if(!hardware) return res.status(404).json({ message: "Hardware not found" });
            res.json(hardware);
        }catch(err){
            console.error("Error fetching grouped hardware list: ", err);
            res.status(500).json({ message: "Failed to fetch hardware" });
        }
    },

    async getAllHardware(req, res) {
        try {
            const groupedHardware = await HardwareRepo.groupHardware();
            res.json(groupedHardware);
        } catch (err) {
            console.error("Error fetching grouped hardware list: ", err);
            res.status(500).json({ error: err.message || "Failed to retrieve grouped hardware." });
        }
    },
    async getAllHardwareAdmin(req, res) {
        try {
            const hardware = await HardwareRepo.findAllHardwareAdmin();
            res.json(hardware);
        } catch (err) {
            console.error("Error fetching hardware : ", err);
            res.status(500).json({ error: err.message || "Failed to retrieve hardware." });
        }
    },
    async getHardwareAvailability(req, res){
        try{
            const availabilityList = await HardwareRepo.getAvailabilityList();
            res.json(availabilityList);
        }catch(err){
            console.error("Error fetching hardware availability list: ", err);
            res.status(500).json({ error: err.message || "Failed to retrieve hardware availability." });
        }
    },
    async createHardware(req, res) {
        try {
            console.log("Incoming hardware body:", req.body);
            const newHardware = await HardwareRepo.createHardware({
                hardwareName: req.body.hardwareName,
                serial: req.body.serial,
                functional: req.body.functional,
                description: req.body.description,
                whoHasId: req.body.whoHasId ?? null,
                hardwareTypeId: req.body.hardwareTypeId,
            });

            res.status(201).json({
                message: "Hardware added successfully",
                hardware: newHardware,
                id: newHardware.id // <--- Add this! (Assuming your Sequelize model populates 'id')
            });

        } catch (err) {
            console.error("Error adding hardware:", err);
            res.status(500).json({ message: "Failed to add hardware", error: err.message });
        }
    },

    async updateHardware(req, res) {
    try {
        const updated = await HardwareRepo.updateHardware(req.params.id, {
            hardwareName: req.body.hardwareName,
            serial: req.body.serial,
            functional: req.body.functional,
            description: req.body.description,
            whoHasId: req.body.whoHasId,
            hardwareTypeId: req.body.hardwareTypeId,
        });
            res.json({ message: "Hardware updated successfully", result: updated });
        } catch (err) {
            console.error("Error updating hardware:", err);
            res.status(500).json({ message: "Failed to update hardware", error: err.message });
        }
    },
    async deleteHardware(req, res) {
        try {
            const deleted = await HardwareRepo.deleteHardware(req.params.id);
            res.json({ message: "Hardware deleted successfully", result: deleted });
        } catch (err) {
            console.error("Error deleting hardware:", err);
            res.status(500).json({ message: "Failed to delete hardware", error: err.message });
        }
    },

    async getTypes(req, res) {
        try { res.json(await HardwareRepo.listTypes()); }
        catch (err) { res.status(500).json({ message: err.message }); }
    },
    async createType(req, res) {
        try {
            const name = String(req.body.name || '').trim();
            if (!name) return res.status(400).json({ message: 'Type name required' });
            res.status(201).json(await HardwareRepo.createType({ name, imageUrl: req.body.imageUrl || null }));
        } catch (err) { res.status(500).json({ message: err.message }); }
    },
    async updateType(req, res) {
        try {
            const changes = {};
            if (req.body.name !== undefined) changes.name = String(req.body.name).trim();
            if (req.body.imageUrl !== undefined) changes.imageUrl = req.body.imageUrl;
            if (changes.name === '') return res.status(400).json({ message: 'Type name required' });
            const type = await HardwareRepo.updateType(req.params.id, changes);
            if (!type) return res.status(404).json({ message: 'Type not found' });
            res.json(type);
        } catch (err) { res.status(500).json({ message: err.message }); }
    },
    async importCSVHardware(req, res) {
        const csvText = req.body;
        if (!csvText) return res.status(400).json({ message: 'Missing CSV' });

        try {
            const parsedCSVData = await parseHardwareCSVToArray(csvText);

            // Process all rows
            for (const row of parsedCSVData) {
                const hardwareObj = {
                    hardwareName: row.hardwareName,
                    hardwareTypeId: (await HardwareRepo.listTypes()).find(t => t.name === row.hardwareName)?.id ||
                        (await HardwareRepo.createType({ name: row.hardwareName, imageUrl: null })).id,
                    serial: row.serial,
                    description: row.description,
                    functional: parseInt(row.functional.toString().trim(), 10)
                };

                await HardwareRepo.createHardware(hardwareObj);
            }

            return res.status(200).json({ message: 'CSV imported successfully', count: parsedCSVData.length, parsedCSVData});
        } catch (err) {
            console.error('CSV import error:', err);
            return res.status(500).json({
                message: 'Error processing CSV',
                error: err.message || err,
            });
        }
    },

}

const parseHardwareCSVToArray = async (csvText) => {
    const rows = [];

    await new Promise((resolve, reject) => {
        Readable.from([csvText])
            .pipe(csv({ mapHeaders: ({ header }) => header.trim().replace(/\s+/g, '') }))
            .on('data', (row) => rows.push(row))
            .on('end', resolve)
            .on('error', reject);
    });

    return rows;
};
module.exports = HardwareController;