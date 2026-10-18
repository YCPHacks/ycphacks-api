const Hardware = require("./Hardware");
const { Sponsor, EventSponsor, SponsorTier } = require("../config/Models");
const HardwareType = require('./HardwareType');

const typeInclude = {
    model: HardwareType,
    as: 'hardwareType',
    attributes: ['id', 'name', 'imageUrl']
};

const HardwareRepo = {
    async findHardwareById(id) {
        return Hardware.findOne({
            where: { id },
            include: [typeInclude]
        });
    },

    async findAllHardware() {
        return Hardware.findAll({
            include: [typeInclude]
        });
    },
    async listTypes() {
        return HardwareType.findAll({
          order: [['name', 'ASC']]
        });
    },

    async createType(data) {
        return HardwareType.create(data);
    },

    async updateType(id, data) {
        const type = await HardwareType.findByPk(id);

        if (!type) return null;

        await type.update(data);
        return type;
    },

    async findType(id) {
        return HardwareType.findByPk(id);
    },

    async groupHardware() {
        const hardwareList = await Hardware.findAll({
            attributes: [
                'id', 'hardwareName', 'hardwareTypeId', 'description', 'serial', 'whoHasId', 'functional'
            ],
            include: [typeInclude]
        });

        const grouped = {};
        const multiWordFamilies = await this.findMultiWordFamilies(hardwareList);

        hardwareList.forEach(item => {

            const isUnavailable = item.whoHasId !== null;
            const fullName = item.hardwareType?.name || item.hardwareName;

            let groupTitle = fullName.split(" ")[0];
            let subtitle = fullName.split(" ").slice(1).join(" ");

            for(const fam of multiWordFamilies){
                if(fullName.startsWith(fam)){
                    groupTitle = fam;
                    subtitle = fullName.replace(fam, "").trim();
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
                fullName: fullName,
                isUnavailable: isUnavailable,
                isFunctional: item.functional,
                name: subtitle || groupTitle,
                subtitle: subtitle,
                description: item.description || "",
                image: item.hardwareType?.imageUrl || null
            });
        });
        return Object.values(grouped);
    },

    async findAllHardwareAdmin() {
        return Hardware.findAll({
            include: [typeInclude]
        });
    },
    async getAvailabilityList(){
        const hardwareList = await Hardware.findAll({
            attributes: ['hardwareName', 'serial']
        });

        const mappedList =  hardwareList.map(item => ({
            name: item.hardwareName,
            serialNumber: item.serial,
        }));

        return mappedList;
    },

    async createHardware(hardware) {
        return await Hardware.create(hardware);
    },

    async updateHardware(id, updatedFields) {
        return Hardware.update(updatedFields, {
            where: { id },
            individualHooks: true
        });
    },

    async deleteHardware(id) {
        return Hardware.destroy({
            where: { id },
            individualHooks: true
        });
    },

    async findMultiWordFamilies(hardwareList) {
        const prefixCounts = new Map();
        const familyCandidates = new Set();

        hardwareList.forEach(item => {
            const words = (item.hardwareType?.name || item.hardwareName).split(/\s+/).filter(w => w.length > 0);

            if (words.length >= 3) {
                const prefix3 = words.slice(0, 3).join(" ");
                prefixCounts.set(prefix3, (prefixCounts.get(prefix3) || 0) + 1);
            }

            if (words.length >= 2) {
                const prefix2 = words.slice(0, 2).join(" ");
                prefixCounts.set(prefix2, (prefixCounts.get(prefix2) || 0) + 1);
            }
        });

        prefixCounts.forEach((count, prefix) => {
            if (count >= 2) {
                let shouldAdd = true;
                for (const existingFamily of familyCandidates) {
                    if (prefix.startsWith(existingFamily + ' ')) {
                        shouldAdd = false;
                        break;
                    }
                }
                if (shouldAdd) {
                    familyCandidates.add(prefix);
                }
            }
        });

        return Array.from(familyCandidates);
    },

};

module.exports = HardwareRepo;