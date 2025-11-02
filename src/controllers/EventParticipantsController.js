const EventParticipantsRepo = require('../repository/team/EventParticipantsRepo');

class EventParticipantController{
    static async getUnassignedParticipants(req, res){
        const eventId = req.params.eventId || 1; 

        try {
            const unassignedUsers = await EventParticipantsRepo.findUnassignedParticipants(eventId);

            res.status(200).json({ 
                message: 'Successfully fetched unassigned participants.', 
                data: unassignedUsers 
            });

        } catch (error) {
            console.error("Error fetching unassigned participants:", error);
            res.status(500).json({ 
                message: 'Failed to fetch unassigned participants.', 
                error: error.message 
            });
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
}

module.exports = EventParticipantController;