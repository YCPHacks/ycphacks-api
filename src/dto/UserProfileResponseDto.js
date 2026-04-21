class UserProfileResponseDto {
    constructor(
        id,
        firstName,
        lastName,
        age,
        gender,
        pronouns,
        country,
        school,
        major,
        graduationYear,
        levelOfStudy,
        tShirtSize,
        hackathonsAttended,
        dietaryRestrictions,
        email,
        isEmailVerified,
        mlhEmails,
        phoneNumber,
        linkedInUrl
    ) {
        this.id = id
        this.firstName = firstName
        this.lastName = lastName
        this.age = age;
        this.gender = gender;
        this.pronouns = pronouns;
        this.country = country;
        this.school = school;
        this.major = major;
        this.graduationYear = graduationYear;
        this.levelOfStudy = levelOfStudy;
        this.tShirtSize = tShirtSize;
        this.hackathonsAttended = hackathonsAttended;
        this.dietaryRestrictions = dietaryRestrictions;
        this.email = email;
        this.isEmailVerified = isEmailVerified;
        this.mlhEmails = mlhEmails;
        this.phoneNumber = phoneNumber;
        this.linkedInUrl = linkedInUrl;
    }
}

module.exports = UserProfileResponseDto;