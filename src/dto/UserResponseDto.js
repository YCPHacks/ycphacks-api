class UserResponseDto {
    constructor(
        id,
        email,
        isEmailVerified,
        firstName,
        lastName,
        token,
    ) {
        this.id = id
        this.email = email
        this.isEmailVerified = true
        this.firstName = firstName
        this.lastName = lastName
        this.token = token
    }
}

module.exports = UserResponseDto