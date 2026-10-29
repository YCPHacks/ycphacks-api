const { Permissions } = require('../config/Models');
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
    }
};

module.exports = PermissionsRepo;