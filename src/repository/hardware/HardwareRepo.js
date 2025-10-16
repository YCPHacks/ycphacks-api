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
        const multiWordFamilies = await this.findMultiWordFamilies(hardwareList);

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
            
            grouped[groupTitle].items.push({
                fullName: item.hardwareName,
                isUnavailable: isUnavailable, 
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

    // Function to determine if the hardwareName is multiworded, like Raspberry Pi
    async findMultiWordFamilies(hardwareList) {
        const prefixCounts = new Map();
        const familyCandidates = new Set();
        
        // 1. Count occurrences of all two- and three-word prefixes
        hardwareList.forEach(item => {
            const words = item.hardwareName.split(/\s+/).filter(w => w.length > 0);
            
            // Check 3-word prefixes (e.g., "Ultrasonic Sensor HC-SR04" -> "Ultrasonic Sensor HC")
            if (words.length >= 3) {
                const prefix3 = words.slice(0, 3).join(" ");
                prefixCounts.set(prefix3, (prefixCounts.get(prefix3) || 0) + 1);
            }

            // Check 2-word prefixes (e.g., "Jumper Wires Set" -> "Jumper Wires")
            if (words.length >= 2) {
                const prefix2 = words.slice(0, 2).join(" ");
                prefixCounts.set(prefix2, (prefixCounts.get(prefix2) || 0) + 1);
            }
        });

        // 2. Identify prefixes that occur more than once (or your defined threshold)
        // The group must have at least 2 unique items to be a "family."
        prefixCounts.forEach((count, prefix) => {
            if (count >= 2) {
                // Only add the prefix if it doesn't contain a shorter, already detected family
                let shouldAdd = true;
                for (const existingFamily of familyCandidates) {
                    if (prefix.startsWith(existingFamily + ' ')) {
                        shouldAdd = false; // Already covered by a shorter family (e.g., 'Raspberry Pi' vs 'Raspberry Pi 4')
                        break;
                    }
                }
                if (shouldAdd) {
                    familyCandidates.add(prefix);
                }
            }
        });

        return Array.from(familyCandidates);
    }
};

module.exports = HardwareRepo;