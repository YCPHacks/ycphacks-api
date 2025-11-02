const EventParticipantModel = require('../../models/EventParticipant');
const UserModel = require('../../models/User');
const {EventParticipant, User} = require('../config/Models');

class EventParticipantRepo {
    static async findParticipantsByTeamId(teamId){
        return EventParticipant.findAll({
            where: { teamId: teamId },
            include: [{ model: User, attributes: ['id', 'firstName', 'lastName'] }],
            raw: true
        });
    }
    static async findUnassignedParticipants(eventId){
        return EventParticipant.findAll({
            where: {
                eventId: eventId,
                teamId: null 
            },
            include: [{ model: User, attributes: ['id', 'firstName', 'lastName', 'email'] }],
            raw: true
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
}

module.exports = EventParticipantRepo;