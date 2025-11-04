const { Team } = require('../config/Models');

const TeamRepo = {
    // Method to create a new Team
    async create(team){
        return Team.create(team);
    },
    // Method to find a team by name
    async findByName(teamName){
        return await Team.findOne({
            where: {teamName}
        });
    },
    async getAllTeams(){
        return await Team.findAll();
    }
}

module.exports = TeamRepo;