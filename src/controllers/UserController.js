const UserRepoModel = require('../repository/user/User')
const UserRepo = require('../repository/user/UserRepo')
const User = require('../models/User')
const UserResponseDto = require('../dto/UserResponseDto')
const { generateToken, validateToken} = require('../util/JWTUtil');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;  // Number of salt rounds for bcrypt
const { sendRegistrationConfirmation } = require('../util/emailService');

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
            userData.firstName,
            userData.lastName,
            userData.email,
            hashedPassword,
            userData.role,
            userData.phoneNumber,
            userData.age,
            userData.gender,
            userData.country,
            userData.tShirtSize,
            userData.dietaryRestrictions,
            userData.school,
            userData.major,
            userData.graduationYear,
            userData.levelOfStudy,
            userData.hackathonsAttended,
            userData.linkedInUrl,
            userData.pronouns,
            userData.checkIn,
            userData.mlhCodeOfConduct,
            userData.mlhPrivacyPolicy,
            userData.mlhEmails,
            userData.isVerified
        )

        // validate data
        const validationErrors = user.validate()
        if (Object.keys(validationErrors).length > 0) {
            return res.status(400).json({
                message: 'Validation errors occurred',
                errors: validationErrors
            });
        }

        const existingUser = await UserRepo.findByEmail(user.email);
        if (existingUser){
            return res.status(400).json({
                message: 'Email is already in use please sign in',
                errors: { email: 'Email is already registered' }
            });
        }

        // Converts to plain object for Sequelize
        const userObj = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            role: user.role,
            phoneNumber: user.phoneNumber,
            age: user.age,
            gender: user.gender,
            country: user.country,
            tShirtSize: user.tShirtSize,
            dietaryRestrictions: user.dietaryRestrictions,
            school: user.school,
            major: user.major,
            graduationYear: user.graduationYear,
            levelOfStudy: user.levelOfStudy,
            hackathonsAttended: user.hackathonsAttended,
            linkedInUrl: user.linkedInUrl,
            pronouns: user.pronouns,
            checkIn: user.checkIn,
            mlhCodeOfConduct: user.mlhCodeOfConduct,
            mlhPrivacyPolicy: user.mlhPrivacyPolicy,
            mlhEmails: user.mlhEmails,
            isVerified: user.isVerified
        };

        // persist user  ONLY IF THE DATA IS VALID
        const persistedUser = await UserRepo.create(userObj);

        // generate JWT
        const token = generateToken({ email: user.email });

        // Fire off confirmation email
        await sendRegistrationConfirmation(user.email, user.firstName);

        // create user response dto
        const userResponseDto = new UserResponseDto(
            persistedUser.id,
            persistedUser.email,
            persistedUser.firstName,
            persistedUser.lastName,
            token,
            user.role
        )

        // send back user response dto
        res.status(201).json({ message: 'Create User successful:', data: userResponseDto });
    } catch (err) {
        // send back any errors (this is where the database errors get thrown)
        res.status(500).json({ message: 'Error persisting user in database:', error: err });
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
            return res.status(400).json({ message: 'Invalid email' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = generateToken({ email: user.email });

        const userResponseDto = new UserResponseDto(
            user.id,
            user.email,
            user.firstName,
            user.lastName,
            token,
            user.role
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
    try {
        const token = req.body.token;

        // Validate the token
        const decodedToken = validateToken(token);
        if (!decodedToken) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Find the user by email
        const user = await UserRepo.findByEmail(decodedToken.email);

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const userResponseDto = new UserResponseDto(
            user.id,
            user.email,
            user.firstName,
            user.lastName,
            token,
            user.role
        )

        // Respond with success and token
        res.status(200).json({
            message: 'Token validated',
            data: userResponseDto
        });
    } catch (err) {
        res.status(500).json({ message: 'Error validating token', error: err.message });
    }
}

const loginAdminUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const roleMap = {
            1: 'participant',
            2: 'staff',
            3: 'oscar',
        };

        // Find the user by email
        const user = await UserRepo.findByEmail(email);

        if (!user) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = generateToken({ email: user.email });

        const userResponseDto = new UserResponseDto(
            user.id,
            user.email,
            user.firstName,
            user.lastName,
            token,
            user.role,
        )

        if (user.role === 'staff' || user.role === 'oscar') {
            // Respond with success and token
            res.status(200).json({
                message: 'Login successful',
                data: userResponseDto
            });
        } else {
            return res.status(403).json({ message: 'Access denied: insufficient permissions' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }

}

const getAllUsers = async (req, res) => {
    try {

        const users = await UserRepo.getAllUsers();
        const userData = users.map(user => ({
            firstName: user.dataValues.firstName,
            lastName: user.dataValues.lastName,
            phoneNumber: user.dataValues.phoneNumber,
            hackathonsAttended: user.dataValues.hackathonsAttended,
            role: user.dataValues.role,
        }));

        res.status(200).json({ message: 'All users', data: userData });
    } catch (err) {
        res.status(500).json({ message: 'Error getting all users', error: err.message });
    }
}

module.exports = {
    createUser,
    loginUser,
    authWithToken,
    loginAdminUser,
    getAllUsers
}