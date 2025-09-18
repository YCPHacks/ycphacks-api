class User {
    constructor(
        firstName,
        lastName,
        email,
        password,
        role,
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
        checkIn,
        mlhCodeOfConduct,
        mlhPrivacyPolicy,
        mlhEmails,
        isVerified
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = role;
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
        this.checkIn = checkIn;
        this.mlhCodeOfConduct = mlhCodeOfConduct;
        this.mlhPrivacyPolicy = mlhPrivacyPolicy;
        this.mlhEmails = mlhEmails;
        this.isVerified = isVerified;
    }

    validate() {
        const errors = []
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // 1. Validate email
        if (!this.email || !emailRegex.test(this.email)) {
            errors.push('Invalid email format');
        }

        // 2. Validate firstName and lastName are less than 50 characters
        if (!this.firstName || this.firstName.length > 50) {
            errors.push('First name must be less than 50 characters');
        }
        if (!this.lastName || this.lastName.length > 50) {
            errors.push('Last name must be less than 50 characters');
        }

        // 3. Validate that the user is at least 13 years old
        if (this.age < 13) {
            errors.push('User must be at least 13 years old');
        }

        // 4. Validate that the MLH Code of Conduct is accepted
        if (!this.mlhCodeOfConduct) {
            errors.push('MLH Code of Conduct must be accepted');
        }

        // 5. Validate that the MLH Privacy Policy is accepted
        if (!this.mlhPrivacyPolicy) {
            errors.push('MLH Privacy Policy must be accepted');
        }

        return errors
    }
}

module.exports = User;