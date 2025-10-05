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
        let groupTitle = '';
        let subtitle = '';

        const multiWordFamilies = ["Raspberry Pi"];

        hardwareList.forEach(item => {
            groupTitle = item.hardwareName.split(" ")[0];
            subtitle = item.hardwareName.split(" ").slice(1).join(" ");

            for(const fam of multiWordFamilies){
                if(item.hardwareName.startsWith(fam)){
                    groupTitle = fam;
                    subtitle = item.hardwareName.replace(fam, "").trim();
                    break;
                }
            }

            if(!grouped[groupTitle]){
                grouped[groupTitle] = {
                    id: groupTitle.toLowerCase().replace(/\s+/g, "-"),
                    title: groupTitle,
                    items: []
                };
            }
            grouped[groupTitle].items.push({
                name: groupTitle,
                subtitle: subtitle,
                description: item.description || "",
                image: item.imageUrl || null
            });
        });
        return Object.values(grouped);
    },

    async getAvailabilityList(){
        const hardwareList = await Hardware.findAll({
            attributes: ['hardwareName', 'serial', 'whoHasId']
        });

        const mappedList =  hardwareList.map(item => ({
            name: item.hardwareName,
            serialNumber: item.serial,
            whoHasId: item.whoHasId
        }));

        // console.log("Mapped Availability Data: ", mappedList);
        return mappedList;
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