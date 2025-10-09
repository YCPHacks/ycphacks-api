class Analytics {
    constructor(
        id,
        year,
        gender,
        country,
        school,
        hackathonsAttended,
        numOfParticipants
    ) {
        this.id = id;
        this.year = year;
        this.gender = gender;
        this.country = country;
        this.school = school;
        this.hackathonsAttended = hackathonsAttended;
        this.numOfParticipants = numOfParticipants;
    }
}

module.exports = Analytics;