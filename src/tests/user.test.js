const request = require('supertest');
const app = require('../app');  // Import your Express app
const UserRepo = require('../repository/user/UserRepo');  // Mock User repository
const { sendRegistrationConfirmation } = require('../util/emailService'); // Adjust path
const bcrypt = require('bcrypt');

const validUserCreateRequest = {
    firstName: 'Jane',
    lastName: 'Doe',
    password: 'strongpassword123!',
    email: 'test@example.com',
    role: 'participant',
    phoneNumber: '+1234567891',
    age: 20,
    gender: 'male',
    country: 'USA',
    tShirtSize: 'M',
    dietaryRestrictions: 'none',
    school: 'Sample University',
    major: 'Computer Science',
    graduationYear: 2027,
    levelOfStudy: 'College',
    hackathonsAttended: 5,
    linkedInUrl: 'https://www.linkedin.com/',
    pronouns: 'she/her',
    checkIn: false,
    mlhCodeOfConduct: true,
    mlhPrivacyPolicy: true,
    mlhEmails: false,
    isVerified: false
};

// Mock the UserRepo to avoid actual database interaction
jest.mock('../repository/user/UserRepo');

// Mock success an actual email isn't sent
jest.mock('../util/emailService', () => ({
    sendRegistrationConfirmation: jest.fn().mockResolvedValue(true),
}));

describe('POST /user/register', () => {
    beforeEach(() => {
        // Reset mock calls before each test
        UserRepo.create.mockReset();
        UserRepo.findByEmail.mockReset();
        jest.restoreAllMocks();
    });

    it('should create a new user and return 201', async () => {
        // Arrange: mock UserRepo and bcrypt
        UserRepo.findByEmail.mockResolvedValue(null); // no existing user
        jest.spyOn(bcrypt, 'hash').mockResolvedValue('$2b$10$Xdummyhash'); // fake hash

        const mockUser = {
            ...validUserCreateRequest,
            toJSON: function() { return this; } // Sequelize-like behavior
        };

        UserRepo.create.mockResolvedValue(mockUser);

        // Act: send the HTTP request
        const res = await request(app)
            .post('/user/register')
            .send({
                ...validUserCreateRequest
            });

        // Assert: response checks
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Create User successful:');
        expect(res.body.data).toHaveProperty('token');

        // Assert: verify mocks were called correctly
        expect(UserRepo.findByEmail).toHaveBeenCalledWith('test@example.com');
        expect(UserRepo.create).toHaveBeenCalledTimes(1);
        expect(UserRepo.create).toHaveBeenCalledWith(expect.objectContaining({
            email: 'test@example.com',
            firstName: 'Jane',
            lastName: 'Doe',
            role: 'participant'
        }));
    });

    it('returns 400 (invalid email)', async () => {
        const res = await request(app)
            .post('/user/register')
            .send({
                ...validUserCreateRequest,
                email: 'invalidemail' // Invalid email
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Validation errors occurred');
        expect(Object.keys(res.body.errors).length).toEqual(1);  // There should be exactly one validation error
    });

    it('returns 400 (email already exists)', async () => {
        // Mock the repository method to simulate a user already existing
        UserRepo.findByEmail.mockResolvedValue({
            id: 1,
            email: validUserCreateRequest.email
        });

        const res = await request(app)
            .post('/user/register')
            .send({
                ...validUserCreateRequest
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Email is already in use please sign in');
        expect(UserRepo.findByEmail).toHaveBeenCalledTimes(1);
    });
});
