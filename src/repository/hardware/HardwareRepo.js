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
    async groupHardware() {
        const hardwareList = await Hardware.findAll();
        const grouped = {};
        let groupTitle = '';
        let subtitle = '';

        const multiWordFamilies = ["Raspberry Pi"];

        hardwareList.forEach(item => {
            
            // Default grouping and subtitle logic
            groupTitle = item.hardwareName.split(" ")[0];
            subtitle = item.hardwareName.split(" ").slice(1).join(" ");

            // Apply multi-word family logic
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
            
            // --- START OF FIX ---
            grouped[groupTitle].items.push({
                // FIX 1: Set 'name' to the unique identifier (the part after the group title)
                // This is the cleanest fix for client-side logic that expects a partial name.
                name: subtitle || groupTitle,
                
                // FIX 2 (CRITICAL): Include the original, full name for the client to use directly.
                // We use a new property, `fullName`, that holds the required value.
                fullName: item.hardwareName,
                
                subtitle: subtitle, // Keep subtitle for consistency
                description: item.description || "",
                image: item.imageUrl || null
            });
            // --- END OF FIX ---
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