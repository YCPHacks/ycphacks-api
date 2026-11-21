const { Permissions, EventParticipant } = require('../config/Models');
const { Op } = require('sequelize');
const PermissionsRepo = {
    /*
    async getAllStaffForEvent() {
        try{
            const staffParticipants = await Permissions.findAll({
                where: {
                    permission: 'staff'
                },
                // Include EventParticipant data
                include: [{
                    model: EventParticipant,
                    as: 'participant',
                    required: true,
                    where: {
                        eventId: eventId
                    },
                    include: [{
                        model: User,
                        required: true,
                        attributes: [
                            'firstName',
                            'lastName'
                        ]
                    }],
                }],
                order: [
                    ['lastName', 'ASC']
                ]
            });
            return staffParticipants;
        } catch (error) {
            console.error("Error fetching staff for event:", error);
            throw new Error('Failed to retrieve staff list.');
        }
    },
    */
    /*
    async findPermissionsById(userId, eventId) {
        try {
            const permissions = await Permissions.findAll({
                where: {
                    participantId:
                }
            })
        }
    }
     */
    async createPermission( participantId, permission) {
        try{
            return await Permissions.create({
                participantId,
                permission
            })
        } catch(err) {
            throw (err);
        }
    },

    async findAllPermissionsById( participantId ) {
        try {
            return await Permissions.findAll({
                attributes: ['permission'],
                where: { participantId: participantId }
            })
        } catch (err) {
            throw err;
        }
    },

    async findAllPermissionsForEvent(eventId) {
        return Permissions.findAll({
            attributes: ['permission', 'participantId'],
            include: [{
                model: EventParticipant,
                as: 'participant',
                attributes: [],
                where: { eventId },
                required: true,
            }],
            logging: console.log,
        });
    },

    async updatePermissionsById(participantId, permissions) {
        try {
            return await Permissions.sequelize.transaction(async (t) => {
                const existing = await Permissions.findAll({
                    attributes: ['permission'],
                    where: { participantId },
                    transaction: t,
                });

                const existingSet = new Set(existing.map(p => p.permission));
                const desiredSet = new Set(permissions);

                const toAdd = [...desiredSet].filter(p => !existingSet.has(p));
                const toRemove = [...existingSet].filter(p => !desiredSet.has(p));

                if (toRemove.length) {
                    await Permissions.destroy({
                        where: { participantId, permission: { [Op.in]: toRemove } },
                        transaction: t,
                    });
                }

                if (toAdd.length) {
                    await Permissions.bulkCreate(
                        toAdd.map(permission => ({ participantId, permission })),
                        { transaction: t }
                    );
                }

                return { added: toAdd, removed: toRemove };
            });
        } catch (err) {
            throw err;
        }
    }
};

module.exports = PermissionsRepo;