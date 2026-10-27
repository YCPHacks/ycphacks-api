class Team {
    constructor(
        eventId,
        teamLeaderId,
        teamName,
        presentationLink,
        githubLink,
        projectName,
        projectDescription
    ) {
        this.eventId = eventId;
        this.teamLeaderId = teamLeaderId;
        this.teamName = teamName;
        this.presentationLink = presentationLink;
        this.githubLink = githubLink;
        this.projectName = projectName;
        this.projectDescription = projectDescription;
    }
    validate() {
        const errors = {};

        if (!this.teamName || this.teamName.trim() === '') {
            errors.teamName = 'Team name is required.';
        }

        if (!this.eventId || typeof this.eventId !== 'number') {
             errors.eventId = 'Valid event ID is required.';
        }
        
        // Add more checks (e.g., project name length, link format, etc.)

        return errors; // Return the object of validation errors
    }
}

module.exports = Team;