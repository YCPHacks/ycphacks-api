class UserResponseDto {
    constructor(
        id,
        email,
        firstName,
        lastName,
        token
    ) {
        this.id = id
        this.email = email
        this.firstName = firstName
        this.lastName = lastName
        this.token = token
    }
}

module.exports = UserResponseDto