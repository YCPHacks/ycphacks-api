const EventParticipantModel = require('../../models/EventParticipant');
const UserModel = require('../../models/User');
const {EventParticipant, User} = require('../config/Models');
const { Op } = require('sequelize');

class EventParticipantRepo {
    static async findParticipantsByTeamId(teamId){
        return EventParticipant.findAll({
            where: { teamId: teamId },
            include: [{ 
                model: User, 
                as: 'userDetails',
                attributes: ['id', 'firstName', 'lastName']
            }],
        });
    }
    static async findUnassignedParticipants(eventId) {
        return EventParticipant.findAll({
            where: {
                eventId: eventId,
                teamId: {
                    [Op.is]: null
                }
            },
            include: [{ 
                model: User, 
                as: 'userDetails',
                attributes: ['id', 'firstName', 'lastName', 'email'] 
            }],
            raw: false
        });
    }
    static async assignToTeam(userId, eventId, teamId){
        const [rowsUpdated] = await EventParticipant.update(
            { teamId: teamId },
            { 
                where: { 
                    userId: userId, 
                    eventId: eventId 
                } 
            }
        );
        return rowsUpdated > 0;
    }
    async getTeams(){
        return await Team.findAll({
            attributes: ["id", "eventId", "teamName", "presentationLink", "githubLink", "projectName", "projectDescription"]
        });
    }
}

module.exports = EventParticipantRepo;