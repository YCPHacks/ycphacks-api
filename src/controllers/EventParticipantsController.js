const EventParticipantsRepo = require('../repository/team/EventParticipantRepo');

class EventParticipantController{
    static async getUnassignedParticipants(req, res) {
        try {
            const eventId = req.query.eventId || 1; 

            const participants = await EventParticipantsRepo.findUnassignedParticipants(eventId);

            const formattedParticipants = participants.map(p => ({
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
}

module.exports = EventParticipantController;