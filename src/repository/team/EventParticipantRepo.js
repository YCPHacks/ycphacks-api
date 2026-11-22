const {EventParticipant, User, Team} = require('../config/Models');
const { Op } = require('sequelize');

class EventParticipantRepo {
    static async findParticipantsByTeamId(teamId){
        return await EventParticipant.findAll({
            attributes: ['id'],
            where: { teamId: teamId },
            include: [{ 
                model: User, 
                as: 'participants',
                attributes: ['firstName', 'lastName'],
                where: {
                    isBanned: { [Op.not]: true }
                }
            }],
        });
    }

    static async getParticipantTeamStatus(participantId) {
        return await EventParticipant.findOne({
            attributes: ['teamId'],
            where: { id: participantId }
        });
    }

    static async findParticipantByUserIdAndEventId(userId, eventId){
        return await EventParticipant.findOne({
            where: { userId: userId, eventId: eventId }
        });
    }
    static async getUsersByEvent(eventId) {
        // List all attributes needed by the controller (from the User model)
        const userAttributes = [
            'id', 'firstName', 'lastName', 'age', 'email', 'phoneNumber',
            'school', 'tShirtSize', 'dietaryRestrictions', 'role',
            'isBanned'
        ];

        try {
            const users = await User.findAll({
                attributes: userAttributes,
                include: [{
                    model: EventParticipant,
                    as: 'participant',
                    where: { eventId: eventId },
                    required: true,
                    // Check-in is per event, so it comes from the participant row
                    attributes: ['checkIn']
                }],
                order: [['lastName', 'ASC'], ['firstName', 'ASC']],
                raw: false
            });
            return users;

        } catch (error) {
            throw error; 
        }
    }
    static async findUnassignedParticipants(eventId) {
        return await EventParticipant.findAll({
            where: {
                eventId: eventId,
                checkIn: true,
                teamId: {
                    [Op.is]: null
                }
            },
            include: [{
                model: User,
                as: 'participants',
                where: {
                    role: 'participant'
                },
                attributes: [
                    'firstName',
                    'lastName',
                    'email'
                ]
            }],
            attributes: [
                'userId'
            ]
        });
    }
    static async assignToTeam(participantId, teamId){
        const [rowsUpdated] = await EventParticipant.update(
            { teamId: teamId },
            { where: {id: participantId} }
        );
        return rowsUpdated > 0;
    }
    async getTeams(){
        return await Team.findAll({
            attributes: ["id", "eventId", "teamName", "presentationLink", "githubLink", "projectName", "projectDescription"]
        });
    }
    static async synchronizeTeamMembers(teamId, desiredParticipantIds, eventId=1){
        const currentMembersRecords = await EventParticipant.findAll({
            attributes: ['userId'],
            where: { teamId: teamId, eventId: eventId },
            raw: true
        });

        const currentMemberIds = currentMembersRecords.map(r => r.userId);

        const membersToAssign = desiredParticipantIds.filter(id => !currentMemberIds.includes(id));

        if (membersToAssign.length > 0) {
            await EventParticipant.update(
                { teamId: teamId },
                {
                    where: {
                        userId: { [Op.in]: membersToAssign },
                        eventId: eventId,
                    },
                    individualHooks: true
                }
            );
        }

        const membersToUnassign = currentMemberIds.filter(id => !desiredParticipantIds.includes(id));

        if (membersToUnassign.length > 0) {
            await EventParticipant.update(
                { teamId: null },
                {
                    where: {
                        userId: { [Op.in]: membersToUnassign },
                        eventId: eventId,
                        teamId: teamId, 
                    },
                    individualHooks: true
                }
            );
        }

        return true;
    }
    static async updateCheckInStatus(userId, eventId, checkIn){
        const [rowsUpdated] = await EventParticipant.update(
            { checkIn: checkIn },
            { where: { userId: userId, eventId: eventId } }
        );
        return rowsUpdated > 0;
    }
    static async addParticipant(userId, eventId){
        const existing = await EventParticipant.findOne({where: {userId, eventId}});
        if(existing){
            throw new Error('Participant is already registered for this event (duplicate).');
        }

        return await EventParticipant.create({
            userId: userId,
            eventId: eventId,
            teamId: null
        });
    }
}

module.exports = EventParticipantRepo;