const request = require('supertest');
const app = require('../app');  // Import your Express app
const UserRepo = require('../repository/user/UserRepo');  // Mock User repository
const bcrypt = require('bcrypt');

// Mock the UserRepo to avoid actual database interaction
jest.mock('../repository/user/UserRepo');

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
            id: 2,
            firstName: 'Jane',
            lastName: 'Doe',
            password: '$2b$10$Xdummyhash',
            email: 'test1@example.com',
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
            linkedInUrl: 'https://www.linkedin.com',
            pronouns: 'her/she',
            checkIn: false,
            mlhCodeOfConduct: true,
            mlhPrivacyPolicy: true,
            mlhEmails: false,
            isVerified: false,
            toJSON: function() { return this; } // Sequelize-like behavior
        };

        UserRepo.create.mockResolvedValue(mockUser);

        // Act: send the HTTP request
        const res = await request(app)
            .post('/user/register')
            .send({
                firstName: 'Jane',
                lastName: 'Doe',
                password: 'strongpassword123!',
                email: 'test1@example.com',
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
                linkedInUrl: 'https://www.linkedin.com',
                pronouns: 'her/she',
                checkIn: false,
                mlhCodeOfConduct: true,
                mlhPrivacyPolicy: true,
                mlhEmails: false,
                isVerified: false
            });

        // Assert: response checks
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Create User successful:');
        expect(res.body.data).toHaveProperty('token');

        // Assert: verify mocks were called correctly
        expect(UserRepo.findByEmail).toHaveBeenCalledWith('test1@example.com');
        expect(UserRepo.create).toHaveBeenCalledTimes(1);
        expect(UserRepo.create).toHaveBeenCalledWith(expect.objectContaining({
            email: 'test1@example.com',
            firstName: 'Jane',
            lastName: 'Doe',
            role: 'participant'
        }));
    });

    it('should return 400 if validation fails (invalid email)', async () => {
        const res = await request(app)
            .post('/user/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                password: 'short',  // Password too short
                email: 'invalidemail',  // Invalid email
                role: 'participant',
                phoneNumber: '+1234567890',
                age: 12,  // Too young
                gender: 'male',
                country: 'USA',
                tShirtSize: 'M',
                dietaryRestrictions: 'none',
                school: 'Sample University',
                major: 'Computer Science',
                graduationYear: 2027,
                levelOfStudy: 'College',
                hackathonsAttended: 5,
                linkedInUrl: 'https://www.linkedin.com',
                pronouns: 'her/she',
                checkIn: false,
                mlhCodeOfConduct: true,
                mlhPrivacyPolicy: true,
                mlhEmails: false,
                isVerified: false
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Validation errors occurred');
        expect(Object.keys(res.body.errors)).toBeGreaterThan(0);  // There should be validation errors
    });

    it('should return 400 if email already exists', async () => {
        // Mock the repository method to simulate a user already existing
        UserRepo.findByEmail.mockResolvedValue({
            id: 1,
            email: 'test@example.com'
        });

        const res = await request(app)
            .post('/user/register')
            .send({
                email: 'test@example.com',  // Existing email
                firstName: 'John',
                lastName: 'Doe',
                password: 'strongpassword123',
                role: 'participant',
                phoneNumber: '+1234567890',
                age: 19,
                gender: 'male',
                country: 'USA',
                tShirtSize: 'M',
                dietaryRestrictions: 'none',
                school: 'Sample University',
                major: 'Computer Science',
                graduationYear: 2027,
                levelOfStudy: 'College',
                hackathonsAttended: 5,
                linkedInUrl: 'https://www.linkedin.com',
                pronouns: 'her/she',
                checkIn: false,
                mlhCodeOfConduct: true,
                mlhPrivacyPolicy: true,
                mlhEmails: false,
                isVerified: false,
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Email is already in use please sign in');
        expect(UserRepo.findByEmail).toHaveBeenCalledTimes(1);
    });
});
