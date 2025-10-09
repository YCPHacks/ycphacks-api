class Team {
    constructor(
        id,
        eventId,
        teamName,
        presentationLink,
        githubLink
    ) {
        this.id = id;
        this.eventId = eventId;
        this.teamName = teamName;
        this.presentationLink = presentationLink;
        this.githubLink = githubLink;
    }
}

module.exports = Team;