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
    },
    async update(teamId, teamData){
        if(teamData.id){
            delete teamData.id;
        }

        const [rowsUpdated] = await Team.update(
            teamData,
            {
                where: {id: teamId}
            }
        );
        return rowsUpdated;
    }
}

module.exports = TeamRepo;