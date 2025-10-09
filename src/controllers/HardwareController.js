const HardwareRepo = require('../repository/hardware/HardwareRepo');
const Hardware = require('../models/Hardware');

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
            const groupedHardware = await HardwareRepo.groupHardwareForFrontend();
            res.json(groupedHardware);
        } catch (err) {
            console.error("Error fetching grouped hardware list: ", err);
            res.status(500).json({ error: err.message || "Failed to retrieve grouped hardware." });
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
    }
}

module.exports = HardwareController;