const request = require('supertest');
const app = require('../app');  // Import your Express app
const UserRepo = require('../repository/user/UserRepo');  // Mock User repository
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

describe('POST /user/register', () => {
    beforeEach(() => {
        // Reset mock calls before each test
        UserRepo.create.mockReset();
        UserRepo.findByEmail.mockReset();
        jest.restoreAllMocks();
    });

    it('creates a new user and returns 201', async () => {
        // Arrange: mock UserRepo and bcrypt
        UserRepo.findByEmail.mockResolvedValue(null); // no existing user
        jest.spyOn(bcrypt, 'hash').mockResolvedValue('$2b$10$Xdummyhash'); // fake hash

        const mockUser = {
            ...validUserCreateRequest,
            password: '$2b$10$Xdummyhash',
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

    it('returns 400 (No first or last name)', async () => {
        const res = await request(app)
            .post('/user/register')
            .send({
                ...validUserCreateRequest,
                firstName: '',
                lastName: ''
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Validation errors occurred');
        expect(Object.keys(res.body.errors).length).toEqual(2);  // There should be exactly two validation errors
        expect(res.body.errors.firstName).toEqual('First name is required and must be less than 50 characters');
        expect(res.body.errors.lastName).toEqual('Last name is required and must be less than 50 characters');
    });

    it('returns 400 (phone number is invalid)', async () => {
        const res = await request(app)
            .post('/user/register')
            .send({
                ...validUserCreateRequest,
                phoneNumber: '45291' // Invalid phone number
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Validation errors occurred');
        expect(Object.keys(res.body.errors).length).toEqual(1);  // There should be exactly one validation error
        expect(res.body.errors.phoneNumber).toEqual('Invalid phone number format');
    });

    it('returns 400 (No school)', async () => {
        const res = await request(app)
            .post('/user/register')
            .send({
                ...validUserCreateRequest,
                school: null
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Validation errors occurred');
        expect(Object.keys(res.body.errors).length).toEqual(1);  // There should be exactly one validation error
        expect(res.body.errors.school).toEqual('School is required');
    });

    it('returns 400 (No level of study)', async () => {
        const res = await request(app)
            .post('/user/register')
            .send({
                ...validUserCreateRequest,
                levelOfStudy: null
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Validation errors occurred');
        expect(Object.keys(res.body.errors).length).toEqual(1);  // There should be exactly one validation error
        expect(res.body.errors.levelOfStudy).toEqual('Level of study is required');
    });

    it('returns 400 (No country)', async () => {
        const res = await request(app)
            .post('/user/register')
            .send({
                ...validUserCreateRequest,
                country: null
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Validation errors occurred');
        expect(Object.keys(res.body.errors).length).toEqual(1);  // There should be exactly one validation error
        expect(res.body.errors.country).toEqual('Country is required');
    });

    it('returns 400 (age too low)', async () => {
        const res = await request(app)
            .post('/user/register')
            .send({
                ...validUserCreateRequest,
                age: 12 // Too young
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Validation errors occurred');
        expect(Object.keys(res.body.errors).length).toEqual(1);  // There should be exactly one validation error
        expect(res.body.errors.age).toEqual('User must be at least 13 years old');
    });

    it('returns 400 (No t-shirt size)', async () => {
        const res = await request(app)
            .post('/user/register')
            .send({
                ...validUserCreateRequest,
                tShirtSize: null
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Validation errors occurred');
        expect(Object.keys(res.body.errors).length).toEqual(1);  // There should be exactly one validation error
        expect(res.body.errors.tShirtSize).toEqual('T-Shirt size is required');
    });

    it('returns 400 (graduation year is invalid)', async () => {
        const res = await request(app)
            .post('/user/register')
            .send({
                ...validUserCreateRequest,
                graduationYear: 2154 // Unreasonable graduation year
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Validation errors occurred');
        expect(Object.keys(res.body.errors).length).toEqual(1);  // There should be exactly one validation error
        expect(res.body.errors.graduationYear).toEqual('Invalid graduation year');
    });

    it('returns 400 (invalid LinkedIn url)', async () => {
        const res = await request(app)
            .post('/user/register')
            .send({
                ...validUserCreateRequest,
                linkedInUrl: 'https://www.fakelink.com' // Not a LinkedIn url
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Validation errors occurred');
        expect(Object.keys(res.body.errors).length).toEqual(1);  // There should be exactly one validation error
        expect(res.body.errors.linkedInUrl).toEqual('Invalid LinkedIn URL');
    });

    it('returns 400 (MLH checks are not true)', async () => {
        const res = await request(app)
            .post('/user/register')
            .send({
                ...validUserCreateRequest,
                mlhCodeOfConduct: false,
                mlhPrivacyPolicy: false
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Validation errors occurred');
        expect(Object.keys(res.body.errors).length).toEqual(2);  // There should be exactly two validation errors
        expect(res.body.errors.mlhCodeOfConduct).toEqual('MLH Code of Conduct must be accepted');
        expect(res.body.errors.mlhPrivacyPolicy).toEqual('MLH Privacy Policy must be accepted');
    });
});
