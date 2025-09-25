const Hardware = require("./Hardware");

const HardwareRepo = {
    //find one hardware item
    async findHardwareById(id) {
        return Hardware.findOne({ where: { id } });
    },

    // Find all hardware items
    async findAllHardware() {
        return Hardware.findAll();
    },

    //Group hardware by name
    async groupHardwareForFrontend() {
        const hardwareList = await Hardware.findAll();
        const grouped = {};

        hardwareList.forEach(item => {
            const title = item.hardwareName;
            if(!grouped[title]){
                grouped[title] = {
                    id: title.toLowerCase().replace(/\s+/g, "-"),
                    title: title,
                    items: []
                };
            }
            grouped[title].items.push({
                name: `${item.hardwareName} ${item.serial}`,
                description: item.description || "",
                image: item.imageUrl || null
            });
        });
        return Object.values(grouped);
    },

    // Create new hardware entry
    async createHardware(hardware) {
        return await Hardware.create(hardware);
    },

    // Update a hardware entry
    async updateHardware(id, updatedFields) {
        return Hardware.update(updatedFields, {
            where: { id },
        });
    },

    // Delete a hardware entry
    async deleteHardware(id) {
        return Hardware.destroy({
            where: { id },
        });
    },
};

module.exports = HardwareRepo;