const EventParticipantsRepo = require('../repository/team/EventParticipantRepo');
const TeamRepo = require('../repository/team/TeamRepo')
const EventRepo = require('../repository/event/EventRepo')
const UserRepo = require('../repository/user/UserRepo')
const EventController = require('../controllers/EventController')
const PermissionsRepo = require("../repository/permissions/PermissionsRepo");
const { generateToken, validateToken} = require('../util/JWTUtil');
const UserResponseDto = require('../dto/UserResponseDto')
const TeamingRequestsRepo = require('../repository/team/TeamingRequestsRepo')

class EventParticipantController{
    static async getParticipantByEventAndUser(req, res) {
        try {

            let eventId = req.query.eventId || null;
            let userId = req.query.userId || null;

            if (eventId == null || userId == null) {
                return res.status(400).json({
                    message: 'One or more required query fields missing. Required fields: eventId, userId'
                });
            }

            eventId = parseInt(eventId);
            if (isNaN(eventId)) {
                return res.status(400).json({message: 'Invalid eventId provided'});
            }

            userId = parseInt(userId);
            if (isNaN(userId)) {
                return res.status(400).json({message: 'Invalid userId provided'});
            }


            const result = await EventParticipantsRepo.findParticipantsByUserIdAndEventId(userId, eventId);

            if (result == null) {
                return res.status(404).json({ message: 'No participant found', data: { participant: null }});
            }

            return res.status(200).json({ message: 'Successfully fetched participant', data: { participant: result } });
        }
        catch (err) {
            return res.status(500).json({ message: 'Error getting participant', error: err.message });
        }
    }

    static async getUnassignedParticipants(req, res) {
        try {
            let eventId = parseInt(req.query.eventId) || null;

            if (eventId == null || isNaN(eventId))
                res.status(400).json({message: 'EventId query field missing or invalid.'});

            const participants = await EventParticipantsRepo.findUnassignedParticipants(eventId);

            const nonBannedParticipants = participants.filter(p =>
                p.participants && p.participants.isBanned !== true && p.participants.isBanned !== 1
            );

            const formattedParticipants = nonBannedParticipants.map(p => ({
                id: p.userId,
                firstName: p.participants?.firstName,
                lastName: p.participants?.lastName,
                email: p.participants?.email,
                checkIn: p.checkIn,
                teamId: p.teamId
            }));

            return res.status(200).json({ message: 'Successfully fetched unassigned participants', data: formattedParticipants });
        } catch (err) {
            console.error("Backend Error in getUnassignedParticipants:", err);
            return res.status(500).json({ message: 'Error getting unassigned participants', error: err.message });
        }
    }
    static async assignParticipant(req, res) {
        const participantId = parseInt(req.params.participantId);
        const teamId = parseInt(req.body.teamId);

        if (!participantId || isNaN(participantId))
            return res.status(400).json({
                message: 'Required field participantId must be a valid integer'
            });

        if (!teamId || isNaN(teamId))
            return res.status(400).json({
                message: 'Required field teamId must be a valid integer'
            });

        try {
            const assignmentSuccess = await EventParticipantsRepo.assignToTeam(participantId, teamId);

            if (!assignmentSuccess)
                return res.status(404).json({ message: `Failed to assign participant to team due to internal server error.` });

            await TeamingRequestsRepo.deleteTeamRequest(teamId, participantId);

            return res.status(200).json({ message: `Participant successfully assigned to team.` });

        } catch (error) {
            console.error("Error assigning participant to team:", error);

            res.status(500).json({
                message: 'Failed to assign participant to team.', 
                error: error.message 
            });
        }
    }
    static async unassignParticipant(req, res){
        const { participantId } = req.body;

        if(!participantId){
            return res.status(400).json({ message: 'Missing participant ID in request body.' });
        }

        if (isNaN(participantId)) {
            return res.status(400).json({message: 'Participant ID is not a valid integer.'});
        }

        try {
            const success = await EventParticipantsRepo.assignToTeam(participantId, null);

            if (success) {
                return res.status(200).json({ message: `Participant successfully unassigned from team.` });
            } else {
                return res.status(404).json({ message: `Participant not found or update failed.` });
            }
        } catch (error) {
            console.error("Error unassigning participant from team:", error);
            res.status(500).json({ 
                message: 'Failed to unassign participant.', 
                error: error.message 
            });
        }
    }
    static async getParticipantTeamStatus(req, res){
        const participantIdParam = req.params.participantId;

        if(!participantIdParam) {
            return res.status(400).json({ message: 'Missing participant ID' });
        }

        try{
            const participantId = parseInt(participantIdParam, 10);

            if (isNaN(participantId)) {
                return res.status(400).json({
                    message: 'Invalid integer passed for parameter participant ID'
                });
            }

            const teamStatus = await EventParticipantsRepo.getParticipantTeamStatus(participantId);

            return res.status(200).json({
                teamId: teamStatus,
                message: 'Successfully retrieved user team status'
            });
        }catch(err){
            console.error("Error fetching user team status:", err);
            return res.status(500).json({ message: 'Server error retrieving team status' });
        }
    }

    static async getActiveParticipantById(req, res) {
        const userId = req.params.userId;
        const eventId = req.query.eventId;

        if(!userId || !eventId){
            return res.status(400).json({ message: 'Missing user ID or event ID' });
        }

        try{
            const participantId = await EventParticipantsRepo.findParticipantsByUserIdAndEventId(userId, eventId);

            return res.status(200).json({
                participantId: participantId,
                message: 'Successfully retrieved participantId'
            });
        } catch(err) {
            console.error("Error fetching participantId", err);
            return res.status(500).json({message: 'Server error retrieving participantId'});
        }

    }

    static async getTeamsByEvent(req, res) {
        try {
            // 1. Get eventId from query parameters
            let { eventId } = req.query;

            if (eventId === 'undefined' || eventId === '') {
                const activeEvent = await EventRepo.findActiveEvent();

                if (!activeEvent) {
                    return res.status(404).json({ error: "No eventId provided and no active event found." });
                }
                eventId = activeEvent.id;
            }

            if (!eventId) {
                return res.status(500).json({ error: "Internal error: Failed to determine event ID." });
            }

            // 2. Call a new repository function to get teams filtered by event
            const teams = await TeamRepo.getTeamsByEvent(eventId); 

            // 3. Map the data for the response
            const teamData = teams.map(team => ({
                id: team.id,
                teamName: team.teamName,
                presentationLink: team.presentationLink || null,
                githubLink: team.githubLink || null, 
                projectName: team.projectName || null,
                projectDescription: team.projectDescription || null,
                
                // Map the team members list
                participants: team.EventParticipants ? 
                    team.EventParticipants.map(participant => {
                        const user = participant.participants; 
                        
                        // Safety check remains valid
                        if (!user) {
                            console.warn(`Participant record in team ${team.id} is missing User details.`);
                            return 'Unknown User'; 
                        }
                        
                        return {
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName
                        };
                    })
                    : []
            }));

            res.status(200).json({ 
                message: `Successfully fetched teams for event ${eventId}`, 
                data: teamData 
            });

        } catch (err) {
            console.error('Error getting teams by event:', err);
            res.status(500).json({ message: 'Error getting teams by event', error: err.message });
        }
    }
    static async addParticipantToEvent(req, res){
        const {userId, eventId} = req.body;

        if(!userId || !eventId){
            return res.status(400).json({ message: 'Missing userId or eventId in request body.' });
        }

        try {
            // The repository method should handle creating the new EventParticipant record.
            const newParticipant = await EventParticipantsRepo.addParticipant(userId, eventId);

            return res.status(201).json({ 
                message: `User ${userId} successfully added as participant to Event ${eventId}.`,
                data: newParticipant 
            });
        } catch (error) {
            console.error("Error adding participant to event:", error);
            // Check for specific error like duplicate entry if the repo provides it
            if (error.message.includes('duplicate')) { 
                return res.status(409).json({ message: 'Participant is already registered for this event.', error: error.message });
            }
            res.status(500).json({ 
                message: 'Failed to add participant to event.', 
                error: error.message 
            });
        }
    }
    static async getEnrollmentStatus(req, res){
        const userId = Number(req.params.id);

        if (Number.isNaN(userId) || !Number.isInteger(userId)) {
            return res.status(400).json({ message: 'User ID is not a valid integer.' });
        }

        try {
            const activeEvent = await EventRepo.findActiveEvent();

            if (!activeEvent) {
                return res.status(200).json({
                    message: 'There is no active event',
                    data: { event: null, isEnrolled: false }
                });
            }

            const participant = await EventParticipantsRepo.findParticipantsByUserIdAndEventId(userId, activeEvent.id);

            return res.status(200).json({
                message: 'Successfully retrieved enrollment status',
                data: {
                    event: { id: activeEvent.id, eventName: activeEvent.eventName, startDate: activeEvent.startDate, endDate: activeEvent.endDate },
                    isEnrolled: !!participant
                }
            });
        } catch (err) {
            console.error("Error fetching enrollment status:", err);
            return res.status(500).json({ message: 'Server error retrieving enrollment status', error: err.message });
        }
    }
    static async enrollInActiveEvent(req, res){
        const userId = Number(req.params.id);

        if (Number.isNaN(userId) || !Number.isInteger(userId)) {
            return res.status(400).json({ message: 'User ID is not a valid integer.' });
        }

        try {
            const activeEvent = await EventRepo.findActiveEvent();

            if (!activeEvent) {
                return res.status(404).json({ message: 'There is no active event to register for.' });
            }

            const user = await UserRepo.getUserById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (user.isBanned) {
                return res.status(403).json({ message: 'Registration declined: This user has been banned from previous events.' });
            }

           const newParticipant = await EventParticipantsRepo.addParticipant(userId, activeEvent.id);

            // Create participant permission for newly created participant
           const newPermission = await PermissionsRepo.createPermission(newParticipant.id, 'participant');

            // Generate JWT token
            const token = generateToken({ email: user.email, permission: [newPermission.permission], id: user.id });
            console.log(newParticipant);
            console.log(newPermission);

            // create user response dto
            const userResponseDto = new UserResponseDto(
                user.id,
                user.email,
                true,
                user.firstName,
                user.lastName,
                token
            )

            return res.status(201).json({
                message: `Successfully registered for ${activeEvent.eventName}`,
                data: {
                    event: { id: activeEvent.id, eventName: activeEvent.eventName, startDate: activeEvent.startDate, endDate: activeEvent.endDate },
                    userResponseDto,
                    isEnrolled: true
                }
            });
        } catch (err) {
            if (err.message.includes('duplicate')) {
                return res.status(409).json({ message: 'You are already registered for this event.' });
            }
            console.error("Error enrolling user in active event:", err);
            return res.status(500).json({ message: 'Failed to register for event.', error: err.message });
        }
    }
    static async updateCheckIn(req, res) {
        const userId = Number(req.params.id);

        const { checkIn } = req.body;

        // console.log(`Received userId: ${userId} (Type: ${typeof userId})`);
        // console.log(`Received checkIn: ${checkIn} (Type: ${typeof checkIn})`);

        if (isNaN(userId) || checkIn === undefined || checkIn === null) {
            return res.status(400).json({
                error: 'Invalid or missing user ID or checkIn status (must be boolean) in request.'
            });
        }

        try {
            const activeEvent = await EventRepo.findActiveEvent();

            if (!activeEvent) {
                return res.status(404).json({ error: 'There is no active event to check in to.' });
            }

            // Check-in is per event, users must be registered for the active event first
            const updated = await EventParticipantsRepo.updateCheckInStatus(
                userId,
                activeEvent.id,
                !!checkIn
            );

            if (!updated) {
                return res.status(404).json({ error: `User ${userId} is not registered for the active event.` });
            }

            return res.status(200).json({
                message: `User ${userId} checked in successfully.`,
                data: { id: userId, eventId: activeEvent.id, checkIn: !!checkIn }
            });

        } catch (error) {
            console.error('Error updating check-in status:', error);
            return res.status(500).json({ error: 'Failed to update user check-in status.' });
        }
    }
    static async validateQR(req, res) {
        try {
            const { email } = req.body;

            if(!email){
                return res.status(400).json({ valid: false});
            }

            const user = await UserRepo.findByEmail(email);

            if(!user){
                return res.json({ valid: false });
            }

            const activeEvent = await EventRepo.findActiveEvent();

            if(!activeEvent){
                return res.json({ valid: false, message: 'There is no active event to check in to.' });
            }

            // Check-in is per event, users must be registered for the active event first
            const checkedIn = await EventParticipantsRepo.updateCheckInStatus(user.id, activeEvent.id, true);

            if(!checkedIn){
                return res.json({ valid: false, message: 'User is not registered for the active event.' });
            }

            //The QR code is valid, return that this is true and the checked in user
            return res.json({
                valid: true,
                user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, checkIn: true }
            });

        } catch (err) {
            res.status(500).json({ valid: false});
        }
    }
    async getTeamsByEvent(eventId) {
        return await Team.findAll({
            where: {
                eventId: eventId
            },
            include: [
                {
                    model: EventParticipant,
                    as: 'EventParticipants',
                    attributes: ['userId', 'teamId'],
                    include: [{
                        model: User,
                        as: 'participants',
                        attributes: ['id', 'firstName', 'lastName'],
                        required: true
                    }]
                }
            ],
            // Select the specific fields needed for the response mapping
            attributes: [
                'id', 
                'teamName', 
                'presentationLink', 
                'githubLink', 
                'projectName', 
                'projectDescription'
            ],
        });
    }
    static async getUsersByEvent(req, res){
        try {
            // 1. Get eventId from query parameters
            let { eventId } = req.query;
            if (eventId === 'undefined' || eventId === '') {

                const activeEvent = await EventRepo.findActiveEvent();

                if (!activeEvent) {
                    return res.status(404).json({ error: "No eventId provided and no active event found." });
                }
                eventId = activeEvent.id; 
            }

            if (!eventId) {
                return res.status(500).json({ error: "Internal error: Failed to determine active event ID." });
            }

            // 2. Call a new repository function to get users filtered by event
            const users = await EventParticipantsRepo.getUsersByEvent(eventId); 

            // 3. Map the data
            const userData = users.map(user => ({
                id: user.dataValues.id,
                firstName: user.dataValues.firstName,
                lastName: user.dataValues.lastName,
                age: user.dataValues.age,
                email: user.dataValues.email,
                phoneNumber: user.dataValues.phoneNumber,
                school: user.dataValues.school,
                tShirtSize: user.dataValues.tShirtSize,
                dietaryRestrictions: user.dataValues.dietaryRestrictions,
                // The query only includes this event's participant row
                checkIn: !!user.participant?.[0]?.checkIn,
                isBanned: user.dataValues.isBanned
            }));

            res.status(200).json({ message: `Successfully fetched users for event ${eventId}`, data: userData });
        } catch (err) {
            res.status(500).json({ message: 'Error getting users by event', error: err.message });
        }
    }

    static async getParticipantsForEvent(req, res) {
        const eventId = req.query.eventId;

        console.log(eventId);
        console.log("it's above!!!");

        if (!eventId) {
            return res.status(400).json({ message: 'Missing event ID in request.' });
        }

        try {
            const participants = await EventParticipantsRepo.findAllParticipantsByEventId(eventId);

            const participantData = participants.map(EventParticipant =>({
                eventId: EventParticipant.dataValues.eventId,
                userId: EventParticipant.dataValues.userId,
                teamId: EventParticipant.dataValues.teamId,
                id: EventParticipant.dataValues.id,
            }));

            res.status(200).json({ message: `Successfully fetched participants for event ${eventId}`, data: participantData});
        } catch (err) {
            res.status(500).json({ message: 'Error getting participants by event', error: err.message});
        }
    }
    static async getStaffForEvent(req, res){
        // Assuming eventId is passed via URL params, e.g., /api/events/1/staff
        const eventId = req.params.eventId; 
        
        if (!eventId) {
            return res.status(400).json({ message: 'Missing event ID in request.' });
        }

        try {
            const staff = await PermissionsRepo.findStaffForEvent(eventId);
            
            // Send the data back to the frontend
            res.status(200).json(staff);
        } catch (error) {
            console.error("Staff route error:", error); 
            res.status(500).json({ message: "Internal server error: Failed to fetch staff list." });
        }
    };

    static async getIncomingTeamingRequests(req, res) {
        const participantId = parseInt(req.params.participantId) || null;

        if (!participantId || isNaN(participantId))
            return res.status(400).json({
                message: 'Required field participantId must be a valid integer'
            });

        try {
            const incomingTeamingRequests = await TeamingRequestsRepo.getAllTeamRequestsForParticipantId(participantId);

            if (!incomingTeamingRequests)
                return res.status(404).json({
                    message: 'No incoming teaming requests found'
                });

            const formattedTeamingRequests = incomingTeamingRequests.map(teamingRequest => ({
                participantId: participantId,
                team: {
                    teamId: teamingRequest.teamId,
                    teamName: teamingRequest.Team.teamName
                }
            }));

            return res.status(200).json({
                teamingRequests: formattedTeamingRequests,
                message: 'Successfully retrieved incoming teaming requests for participant'
            });

        } catch (err) {
            return res.status(500).json({
                message: 'Failed to retrieve incoming teaming requests due to server error'
            });
        }
    }

    static async acceptIncomingTeamRequest(req, res) {
        const teamId = parseInt(req.params.teamId) || null;
        const participantId = parseInt(req.params.participantId) || null


        if (!teamId || isNaN(teamId))
            return res.status(400).json({message: 'Required field teamId must be a valid integer.'});

        if (!participantId || isNaN(participantId))
            return res.status(400).json({message: 'Required field participantId must be a valid integer.'});


        try {
            const addToTeamSuccess = EventParticipantsRepo.assignToTeam(participantId, teamId);

            if (!addToTeamSuccess)
                return res.status(500).json({
                    message: 'Failed to accept team request due to server error'
                });

            const deletionSuccess = await TeamingRequestsRepo.deleteTeamRequest(teamId, participantId);

            if (!deletionSuccess)
                return res.status(500).json({
                    message: 'Failed to accept team request due to server error'
                });

            return res.status(200).json({
                message: 'Successfully accepted teaming request'
            });

        } catch (err) {
            return res.status(500).json({message: 'Failed to accept teaming request due to server error'});
        }
    }

    static async declineIncomingTeamRequest(req, res) {
        const teamId = parseInt(req.body.teamId) || null;
        const participantId = parseInt(req.params.participantId) || null

        if (!teamId || isNaN(teamId))
            return res.status(400).json({message: 'Required field teamId must be a valid integer.'});

        if (!participantId || isNaN(participantId))
            return res.status(400).json({message: 'Required field participantId must be a valid integer.'});


        try {
            const deletionSuccess = await TeamingRequestsRepo.deleteTeamRequest(teamId, participantId);

            if (!deletionSuccess)
                return res.status(500).json({
                    message: 'Failed to decline team request due to server error'
                });

            return res.status(200).json({
                message: 'Successfully declined teaming request'
            });

        } catch (err) {
            return res.status(500).json({message: 'Failed to decline teaming request due to server error'});
        }
    }
}

module.exports = EventParticipantController;