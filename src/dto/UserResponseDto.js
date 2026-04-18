class UserResponseDto {
    constructor(
        id,
        email,
        isEmailVerified,
        firstName,
        lastName,
        token,
        role
    ) {
        this.id = id
        this.email = email
        this.isEmailVerified = true
        this.firstName = firstName
        this.lastName = lastName
        this.token = token
        this.role = role
    }
}

module.exports = UserResponseDto