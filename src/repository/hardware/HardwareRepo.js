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
        const hardwareList = await Hardware.findAll({
            attributes: [
                'id', 'hardwareName', 'description', 'serial', 'whoHasId', 
                // Add other necessary fields like 'functional' or 'imageUrl'
            ]
        });
        
        const grouped = {};
        const multiWordFamilies = ["Raspberry Pi"];

        hardwareList.forEach(item => {
            
            // Availability calculation (TRUE if someone has it)
            const isUnavailable = item.whoHasId !== null; 

            // Existing grouping logic...
            let groupTitle = item.hardwareName.split(" ")[0];
            let subtitle = item.hardwareName.split(" ").slice(1).join(" ");
            
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
            
            // --- FINAL ITEM PUSH FIX ---
            grouped[groupTitle].items.push({
                // Ensure the full, unique name is present for client-side mapping
                fullName: item.hardwareName,
                
                // This is what the client-side logic needs to calculate availability
                isUnavailable: isUnavailable, 
                
                // Keep original naming structure for flexibility
                name: subtitle || groupTitle,
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
            whoHasId: item.whoHasId,
            isUnavailable: item.whoHasId !== null
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