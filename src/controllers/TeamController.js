const TeamModel = require('../repository/team/Team')
const TeamRepo = require('../repository/team/TeamRepo')
const Team = require('../models/Team')
const TeamDto = require('../dto/TeamDto')
const EventParticipantsRepo = require('../repository/team/EventParticipantRepo')

class TeamController {
    static async createTeam(req, res) {
        try{
            const teamData = req.body
            const team = new Team(
                teamData.eventId,
                teamData.teamName,
                teamData.presentationLink,
                teamData.githubLink,
                teamData.projectName,
                teamData.projectDescription
            )

            const validationErrors = team.validate()
            if(Object.keys(validationErrors).length > 0){
                return res.status(400).json({
                    message: 'Validation errors occurred when creating teams',
                    errors: validationErrors
                });
            }

            const teamObj = {
                teamName: team.teamName,
                projectName: team.projectName,
                projectDescription: team.projectDescription,
                presentationLink: team.presentationLink,
                githubLink: team.githubLink,
                eventId: team.eventId
            };

            const persistedTeam = await TeamRepo.create(teamObj);

            const teamDataValues = persistedTeam.dataValues || persistedTeam;

            const responseDto = new TeamDto(
                teamDataValues.eventId,
                teamDataValues.teamName,
                teamDataValues.presentationLink,
                teamDataValues.githubLink,
                teamDataValues.projectName,
                teamDataValues.projectDescription
            );

            res.status(201).json({ message: 'Create Team successful:', data: responseDto });
        }catch(err){
            res.status(500).json({ message: 'Error persisting team in database:', error: err.message || JSON.stringify(err) });
        }
    }

    static async getAllTeams(req, res) {
        try{
            const teams = await TeamRepo.getAllTeams();
            const teamDataPromises = teams.map(async (team) => {
                const teamId = team.dataValues.id;

                const participants = await EventParticipantsRepo.findParticipantsByTeamId(teamId);
                
                return {
                    id: teamId,
                    teamName: team.dataValues.teamName,
                    projectName: team.dataValues.projectName,
                    projectDescription: team.dataValues.projectDescription,
                    presentationLink: team.dataValues.presentationLink,
                    githubLink: team.dataValues.githubLink,
                    eventId: team.dataValues.eventId,
                    participants: participants
                };
            });
            
            const teamData = await Promise.all(teamDataPromises);

            res.status(200).json({ message: 'Successfully fetched all teams', data: teamData });
        }catch(err){
            console.error("Backend Error in getAllTeams:", err);
            res.status(500).json({ message: 'Error getting all teams', error:err.message });
        }
    }
}

module.exports = TeamController;