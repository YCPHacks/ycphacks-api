const EventParticipantsRepo = require('../repository/team/EventParticipantRepo');

class EventParticipantController{
    static async getUnassignedParticipants(req, res) {
        try {
            const eventId = req.query.eventId || 1; 

            const participants = await EventParticipantsRepo.findUnassignedParticipants(eventId);

            const nonBannedParticipants = participants.filter(p =>
                p.userDetails && p.userDetails.isBanned !== true && p.userDetails.isBanned !== 1
            );

            const formattedParticipants = nonBannedParticipants.map(p => ({
                id: p.userId,
                firstName: p.userDetails?.firstName,
                lastName: p.userDetails?.lastName,
                email: p.userDetails?.email,
                checkIn: p.userDetails?.checkIn,
                teamId: p.teamId
            }));

            res.status(200).json({ message: 'Successfully fetched unassigned participants', data: formattedParticipants });
        } catch (err) {
            console.error("Backend Error in getUnassignedParticipants:", err);
            res.status(500).json({ message: 'Error getting unassigned participants', error: err.message });
        }
    }
    static async assignParticipant(req, res) {
        const { userId, eventId, teamId } = req.body;

        if (!userId || !eventId || !teamId) {
            return res.status(400).json({ message: 'Missing userId, eventId, or teamId in request body.' });
        }

        try {
            const success = await EventParticipantsRepo.assignToTeam(userId, eventId, teamId);

            if (success) {
                return res.status(200).json({ message: `User ${userId} successfully assigned to Team ${teamId}.` });
            } else {
                return res.status(404).json({ message: `Event participant record for user ${userId} not found or update failed.` });
            }
        } catch (error) {
            console.error("Error assigning participant to team:", error);
            res.status(500).json({ 
                message: 'Failed to assign participant to team.', 
                error: error.message 
            });
        }
    }
    static async unassignParticipant(req, res){
        const {userId, eventId} = req.body;

        if(!userId || !eventId){
            return res.status(400).json({ message: 'Missing userId or eventId in request body.' });
        }

        try {
            const success = await EventParticipantsRepo.assignToTeam(userId, eventId, null);

            if (success) {
                return res.status(200).json({ message: `User ${userId} successfully unassigned from team.` });
            } else {
                return res.status(404).json({ message: `Event participant record for user ${userId} not found or update failed.` });
            }
        } catch (error) {
            console.error("Error unassigning participant from team:", error);
            res.status(500).json({ 
                message: 'Failed to unassign participant.', 
                error: error.message 
            });
        }
    }
    static async getUserTeamStatus(req, res){
        const userId = req.params.userId;
        const eventId = req.query.eventId;

        if(!userId || !eventId){
            return res.status(400).json({ message: 'Missing user ID or event ID' });
        }

        try{
            const participant = await EventParticipantsRepo.findParticipantsByUserIdAndEventId(userId, eventId);

            const teamId = participant ? participant.teamId : null;

            return res.status(200).json({
                teamId: teamId,
                message: 'Successfully retrieved user team status'
            });
        }catch(err){
            console.error("Error fetching user team status:", err);
            return res.status(500).json({ message: 'Server error retrieving team status' });
        }
    }
}

module.exports = EventParticipantController;