class User {
    constructor(
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        age,
        gender,
        country,
        tShirtSize,
        dietaryRestrictions,
        school,
        major,
        graduationYear,
        levelOfStudy,
        hackathonsAttended,
        linkedInUrl,
        pronouns,
        mlhCodeOfConduct,
        mlhPrivacyPolicy,
        mlhEmails,
        isEmailVerified
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.age = age;
        this.gender = gender;
        this.country = country;
        this.tShirtSize = tShirtSize;
        this.dietaryRestrictions = dietaryRestrictions;
        this.school = school;
        this.major = major;
        this.graduationYear = graduationYear;
        this.levelOfStudy = levelOfStudy;
        this.hackathonsAttended = hackathonsAttended;
        this.linkedInUrl = linkedInUrl;
        this.pronouns = pronouns;
        this.mlhCodeOfConduct = mlhCodeOfConduct;
        this.mlhPrivacyPolicy = mlhPrivacyPolicy;
        this.mlhEmails = mlhEmails;
        this.isEmailVerified = isEmailVerified;
    }
}

module.exports = User;