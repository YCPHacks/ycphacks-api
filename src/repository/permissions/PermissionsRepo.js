const { Permissions, EventParticipant, User } = require('../config/Models');
const { Op } = require('sequelize');
const PermissionsRepo = {
    async findStaffForEvent(eventId) {
        try {
            const staffParticipants = await Permissions.findAll({
                where: { permission: 'staff' },
                include: [{
                    model: EventParticipant,
                    as: 'participant',
                    required: true,
                    where: { eventId },
                    include: [{
                        model: User,
                        as: 'participants',
                        required: true,
                        attributes: ['id', 'firstName', 'lastName'],
                    }],
                }],
                order: [
                    [
                        { model: EventParticipant, as: 'participant' },
                        { model: User, as: 'participants' },
                        'lastName',
                        'ASC',
                    ],
                ],
            });
            return staffParticipants
                .map(row => ({
                    participantId: row.participantId,
                    userId: row.participant.participants.id,
                    firstName: row.participant.participants.firstName,
                    lastName: row.participant.participants.lastName,
                }))
                .sort((a, b) => a.lastName.localeCompare(b.lastName));;
        } catch (error) {
            console.error("Error fetching staff for event:", error);
            throw new Error('Failed to retrieve staff list.');
        }
    },

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