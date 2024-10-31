const UserRepoModel = require('../repository/user/User')
const UserRepo = require('../repository/user/UserRepo')
const User = require('../models/User')
const UserResponseDto = require('../dto/UserResponseDto')
const { generateToken, validateToken} = require('../util/JWTUtil');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;  // Number of salt rounds for bcrypt
/**
 * This function will create a user based on the data that gets sent in and return
 * the users id, email, first name, and token on success
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const createUser = async (req, res) => {
    try {

        // convert user into user model
        const userData = req.body
        const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
        const user = new User(
            userData.email,
            userData.firstName,
            userData.lastName,
            hashedPassword,
            userData.role,
            userData.phoneNumber,
            userData.dob,
            userData.gender,
            userData.pronouns,
            userData.country,
            userData.tShirtSize,
            userData.dietaryRestrictions,
            userData.school,
            userData.hackathonsAttended,
            userData.mlhCodeOfConduct,
            userData.mlhPrivacyPolicy,
            userData.mlhEmails
        )

        // validate data
        const validationErrors = user.validate()
        if (validationErrors.length > 0) {
            return res.status(400).json({
                message: 'Validation errors occurred',
                errors: validationErrors
            });
        }

        // persist user  ONLY IF THE DATA IS VALID
        const persistedUser = await UserRepoModel.create(user);

        // generate JWT
        const token = generateToken({ email: user.email });

        // TODO: fire off verification email
        // this will need to be added once we have the email from Dr. Babcock

        // create user response dto
        const userResponseDto = new UserResponseDto(
            persistedUser.id,
            persistedUser.email,
            persistedUser.firstName,
            persistedUser.lastName,
            token
        )

        // send back user response dto
        res.status(201).json({ message: 'Create User successful:', data: userResponseDto });
    } catch (err) {
        // send back any errors (this is where the database errors get thrown)
        res.status(500).json({ message: 'Error persisting user in database:', error: "Email is already in use please sign in" });
    }
}

/**
 * This function will log in a user by verifying the password
 * if it can find a user with that email, it will return the users
 * id, email, first name, and token on success
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await UserRepo.findByEmail(email);

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = generateToken({ email: user.email });

        const userResponseDto = new UserResponseDto(
            user.id,
            user.email,
            user.firstName,
            user.lastName,
            token
        )

        // Respond with success and token
        res.status(200).json({
            message: 'Login successful',
            data: userResponseDto
        });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
};

const authWithToken = async (req, res) => {

}

module.exports = {
    createUser,
    loginUser,
    authWithToken
}