class UserResponseDto {
    constructor(
        id,
        email,
        isEmailVerified,
        firstName,
        lastName,
        token,
        notificationPreference_toast
    ) {
        this.id = id
        this.email = email
        this.isEmailVerified = true
        this.firstName = firstName
        this.lastName = lastName
        this.token = token
        this.notificationPreference_toast = notificationPreference_toast
    }
}

module.exports = UserResponseDto