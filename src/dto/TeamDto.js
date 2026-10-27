class TeamDto{
    constructor(
        id,
        eventId,
        teamLeaderId,
        teamName,
        presentationLink,
        githubLink,
        projectName,
        projectDescription
    ) {
        this.id = id;
        this.eventId = eventId;
        this.teamLeaderId = teamLeaderId;
        this.teamName = teamName;
        this.presentationLink = presentationLink;
        this.githubLink = githubLink;
        this.projectName = projectName;
        this.projectDescription = projectDescription;
    }
}

module.exports = TeamDto