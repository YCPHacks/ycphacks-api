class UserResponseDto {
    constructor(
        id,
        email,
        firstName,
        token
    ) {
        this.id = id
        this.email = email
        this.firstName = firstName
        this.token = token
    }
}

module.exports = UserResponseDto