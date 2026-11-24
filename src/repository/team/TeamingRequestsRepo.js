const { TeamingRequests, Team, User, EventParticipant } = require('../config/Models');

const TeamingRequestsRepo = {
    async getAllTeamRequestsForTeamId(teamId) {
        return await TeamingRequests.findAll({
            where: { teamId: teamId },
            include: {
                model: EventParticipant,
                attributes: ['id'],

                include: {
                    model: User,
                    as: 'participants',
                    attributes: ['firstName', 'lastName']
                }
            },
            order: [['createdAt', 'DESC']]
        })
    },

    async getAllTeamRequestsForParticipantId(participantId) {
        return await TeamingRequests.findAll({
            where: { participantId: participantId },
            include: {
                model: Team,
                attributes: ['teamName']
            },
            order: [['createdAt', 'DESC']]
        })
    },

    async createTeamRequest(sendingTeamId, receivingParticipantId) {
        return await TeamingRequests.create({
            teamId: sendingTeamId,
            participantId: receivingParticipantId,
            createdAt: new Date(Date.now()).toISOString()
        });
    },

    async deleteTeamRequest(sendingTeamId, receivingParticipantId) {
        return await TeamingRequests.destroy({
            where: {
                teamId: sendingTeamId,
                participantId: receivingParticipantId
            }
        })
    }
}

module.exports = TeamingRequestsRepo;