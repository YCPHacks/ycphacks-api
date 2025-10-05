const HardwareRepo = require('../repository/hardware/HardwareRepo');
const Hardware = require('../models/Hardware');

const HardwareController = {
    async getHardwareById(req, res) {
        try{
            const hardware = await HardwareRepo.findHardwareById(req.params.id);
            if(!hardware) return res.status(404).json({ message: "Hardware not found" });
            res.json(hardware);
        }catch(err){
            console.error(err);
            res.status(500).json({ message: "Failed to fetch hardware" });
        }
    },

    async getAllHardware(req, res) {
        const groupedHardware = await HardwareRepo.groupHardwareForFrontend();
        res.json(groupedHardware);
    },

    async getHardwareAvailability(req, res){
        try{
            const availabilityList = await HardwareRepo.getAvailabilityList();
            res.json(availabilityList);
        }catch(err){
            console.error("Error fetching hardware availability list: ", err);
        }
    }
}

module.exports = HardwareController;