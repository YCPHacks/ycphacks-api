class User {
    constructor(
        email,
        firstName,
        lastName,
        password,
        role,
        phoneNumber,
        dob,
        gender,
        pronouns,
        country,
        tShirtSize,
        dietaryRestrictions,
        school,
        hackathonsAttended,
        mlhCodeOfConduct,
        mlhPrivacyPolicy,
        mlhEmails
    ) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.role = role;
        this.phoneNumber = phoneNumber;
        this.dob = dob;
        this.gender = gender;
        this.pronouns = pronouns;
        this.country = country;
        this.tShirtSize = tShirtSize;
        this.dietaryRestrictions = dietaryRestrictions;
        this.school = school;
        this.hackathonsAttended = hackathonsAttended;
        this.mlhCodeOfConduct = mlhCodeOfConduct;
        this.mlhPrivacyPolicy = mlhPrivacyPolicy;
        this.mlhEmails = mlhEmails;
    }

    validate() {
        const errors = []
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format for phone numbers

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

        // 3. Validate phone number is in a valid format
        if (!this.phoneNumber || !phoneRegex.test(this.phoneNumber)) {
            errors.push('Invalid phone number format');
        }

        // 4. Validate that the user is at least 13 years old
        const today = new Date();
        const dob = new Date(this.dob);
        let age = today.getFullYear() - dob.getFullYear();
        const monthDifference = today.getMonth() - dob.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        if (age < 13) {
            errors.push('User must be at least 13 years old');
        }

        // 5. Validate that the MLH Code of Conduct is accepted
        if (!this.mlhCodeOfConduct) {
            errors.push('MLH Code of Conduct must be accepted');
        }

        // 6. Validate that the MLH Privacy Policy is accepted
        if (!this.mlhPrivacyPolicy) {
            errors.push('MLH Privacy Policy must be accepted');
        }

        return errors
    }
}

module.exports = User;