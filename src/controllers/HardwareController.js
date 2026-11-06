const HardwareRepo = require('../repository/hardware/HardwareRepo');
const Hardware = require('../models/Hardware');
const EventRepo = require("../repository/event/EventRepo");
const {Readable} = require("stream");
const csv = require("csv-parser");
const { sequelize } = require('../repository/config/index');
const HardwareModel = require('../repository/hardware/Hardware');
const HardwareTypeModel = require('../repository/hardware/HardwareType');


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
        try {
            const types = await HardwareRepo.listTypes();
            res.json(types);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async createType(req, res) {
        try {
            const name = String(req.body.name || '').trim();

            if (!name) {
                return res.status(400).json({ message: 'Type name required' });
            }

            const type = await HardwareRepo.createType({
                name,
                imageUrl: req.body.imageUrl || null
            });

            res.status(201).json(type);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async updateType(req, res) {
        try {
            const changes = {};

            if (req.body.name !== undefined) {
                changes.name = String(req.body.name).trim();
            }

            if (req.body.imageUrl !== undefined) {
                changes.imageUrl = req.body.imageUrl;
            }

            if (changes.name === '') {
                return res.status(400).json({ message: 'Type name required' });
            }

            const type = await HardwareRepo.updateType(req.params.id, changes);

            if (!type) {
                return res.status(404).json({ message: 'Type not found' });
            }

            res.json(type);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async importCSVHardware(req, res) {
        if (typeof req.body !== 'string' || !req.body.trim()) {
            return res.status(400).json({ message: 'Missing CSV' });
        }

        try {
            const { rows, headers } = await parseHardwareCSVToArray(req.body);
            if (!headers.includes('hardwaretype') || !rows.length) {
                return res.status(400).json({
                    message: 'CSV must contain a Hardware Type column and at least one item'
                });
            }

            const clean = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
            const key = (value) => clean(value).toLowerCase();
            const functionalValue = (value, rowNumber) => {
                const answer = key(value);
                if (!answer || ['yes', 'y', 'true', '1'].includes(answer)) return true;
                if (['no', 'n', 'false', '0'].includes(answer)) return false;
                const err = new Error(`Row ${rowNumber}: invalid Functional value: ${value}`);
                err.status = 400;
                throw err;
            };

            // Validate the entire file before inserting anything.
            const items = rows.map((row, index) => {
                const rowNumber = index + 2;
                const typeName = clean(row.hardwaretype);
                const name = clean(row.name);
                const image = clean(row.image);
                const serial = clean(row.serialnumber) || '<missing serial>';
                const description = clean(row.description) || null;

                if (!typeName) {
                    const err = new Error(`Row ${rowNumber}: Hardware Type is required`);
                    err.status = 400;
                    throw err;
                }
                if (typeName.length > 100 || name.length > 100 ||
                    serial.length > 255 || (description && description.length > 255) ||
                    image.length > 255) {
                    const err = new Error(`Row ${rowNumber}: a field exceeds its database length limit`);
                    err.status = 400;
                    throw err;
                }

                return {
                    typeName, name, image, serial, description,
                    functional: functionalValue(row.functional, rowNumber),
                    rowNumber
                };
            });

            // All records are created together, or none are created if an insert fails.
            const result = await sequelize.transaction(async (transaction) => {
                const types = await HardwareTypeModel.findAll({ transaction });
                const typeMap = new Map(types.map(type => [key(type.name), type]));
                const existing = await HardwareModel.findAll({
                    attributes: ['hardwareName'], transaction
                });
                const usedNames = new Set(existing.map(item => key(item.hardwareName)));
                const nextNumber = new Map();
                let typesCreated = 0;

                for (const item of items) {
                    const typeKey = key(item.typeName);
                    let type = typeMap.get(typeKey);

                    if (!type) {
                        type = await HardwareTypeModel.create({
                            name: item.typeName,
                            imageUrl: item.image || null
                        }, { transaction });
                        typeMap.set(typeKey, type);
                        typesCreated++;
                    } else if (item.image && !type.imageUrl) {
                        // A blank image must not replace an existing type image.
                        await type.update({ imageUrl: item.image }, { transaction });
                    }

                    let name = item.name;
                    if (!name) {
                        let number = nextNumber.get(typeKey) || 1;
                        do {
                            name = `${type.name} (${number++})`;
                        } while (usedNames.has(key(name)));
                        nextNumber.set(typeKey, number);
                    }

                    if (name.length > 100) {
                        const err = new Error(`Row ${item.rowNumber}: generated Name exceeds 100 characters`);
                        err.status = 400;
                        throw err;
                    }

                    await HardwareModel.create({
                        hardwareName: name,
                        hardwareTypeId: type.id,
                        serial: item.serial,
                        description: item.description,
                        functional: item.functional,
                        whoHasId: null
                    }, { transaction });
                    usedNames.add(key(name));
                }

                return { count: items.length, typesCreated };
            });

            return res.status(200).json({
                message: `Imported ${result.count} hardware items successfully`,
                ...result
            });
        } catch (err) {
            console.error('CSV hardware import error:', err);
            const status = err.status === 400 ? 400 : 500;
            return res.status(status).json({
                message: status === 400 ? err.message : 'Error processing CSV',
                ...(status === 500 ? { error: err.message } : {})
            });
        }
    },

}

const parseHardwareCSVToArray = async (csvText) => {
    const rows = [];
    let headers = [];
    await new Promise((resolve, reject) => {
        Readable.from([csvText])
            .pipe(csv({
                mapHeaders: ({ header }) =>
                    header.replace(/^\uFEFF/, '').trim().toLowerCase().replace(/[^a-z0-9]/g, '')
            }))
            .on('headers', parsed => { headers = parsed; })
            .on('data', row => rows.push(row))
            .on('end', resolve)
            .on('error', reject);
    });
    return { rows, headers };
};
module.exports = HardwareController;
