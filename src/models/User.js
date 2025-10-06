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
        const errors = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // 1. Validate email
        if (!this.email || !emailRegex.test(this.email)) {
            errors.email = 'Invalid email format';
        }

        // 2. Validate password is present and at least 8 characters
        if (!this.password || this.password.length < 8) {
            errors.password = 'Password must be at least 8 characters long';
        }

        // 3. Validate firstName and lastName are less than 50 characters
        if (!this.firstName || this.firstName.length > 50) {
            errors.firstName = 'First name must be less than 50 characters';
        }
        if (!this.lastName || this.lastName.length > 50) {
            errors.lastName = 'Last name must be less than 50 characters';
        }

        // 4. Validate phoneNumber is roughly valid
        const phoneRegex = /^[+()\-.\s\d]{7,20}$/;
        if (this.phoneNumber && !phoneRegex.test(this.phoneNumber)) {
            errors.phoneNumber = 'Invalid phone number format';
        }

        // 5. Validate levelOfStudy presence
        if (!this.levelOfStudy) {
            errors.levelOfStudy = 'Level of study is required'
        }

        // 6. Validate country is present
        if (!this.country) {
            errors.country = 'Country is required';
        }

        // 7. Validate that the user is at least 13 years old
        if (this.age < 13) {
            errors.age = 'User must be at least 13 years old';
        }

        // 8. Validate tShirtSize presence
        if (!this.tShirtSize) {
            errors.tShirtSize = 'T-Shirt size is required'
        }

        // 9. Validate graduation year is numeric and in reasonable range
        const year = new Date().getFullYear();
        if (this.graduationYear && (this.graduationYear < 1900 || this.graduationYear > year + 20)) {
            errors.graduationYear = 'Invalid graduation year';
        }

        // 10. Validate LinkedIn is roughly valid
        const linkedInRegex = /^https?:\/\/(www\.)?linkedin\.com\/.*$/;
        if (this.linkedInUrl && !linkedInRegex.test(this.linkedInUrl)) {
            errors.linkedInUrl = 'Invalid LinkedIn URL';
        }

        // 11. Validate that the MLH Code of Conduct is accepted
        if (!this.mlhCodeOfConduct) {
            errors.mlhCodeOfConduct = 'MLH Code of Conduct must be accepted';
        }

        // 12. Validate that the MLH Privacy Policy is accepted
        if (!this.mlhPrivacyPolicy) {
            errors.mlhPrivacyPolicy = 'MLH Privacy Policy must be accepted';
        }

        return errors
    }
}

module.exports = User;