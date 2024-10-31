const request = require('supertest');
const app = require('../app');  // Import your Express app
const UserRepo = require('../repository/user/UserRepo');  // Mock User repository

// Mock the UserRepo to avoid actual database interaction
jest.mock('../repository/user/UserRepo', () => ({
    create: jest.fn(),
    findByEmail: jest.fn()
}));``

describe('POST /register', () => {
    beforeEach(() => {
        // Reset mock calls before each test
        UserRepo.create.mockReset();
        UserRepo.findByEmail.mockReset();
    });

    it('should create a new user and return 201', async () => {
        // Mock the repository method to simulate user creation
        UserRepo.create.mockResolvedValue({
            id: 1,
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe'
        });

        const res = await request(app)
            .post('/register')
            .send({
                email: 'test@example.com',
                firstName: 'John',
                lastName: 'Doe',
                password: 'strongpassword123',
                role: 'user',
                phoneNumber: '+1234567890',
                dob: '2000-01-01',
                gender: 'male',
                pronouns: 'he/him',
                country: 'USA',
                tShirtSize: 'M',
                dietaryRestrictions: 'none',
                school: 'Sample University',
                hackathonsAttended: 5,
                mlhCodeOfConduct: true,
                mlhPrivacyPolicy: true,
                mlhEmails: false
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Create User successful:');
        expect(res.body.data).toHaveProperty('token');
        expect(UserRepo.create).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if validation fails (invalid email)', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                email: 'invalidemail',  // Invalid email
                firstName: 'John',
                lastName: 'Doe',
                password: 'short',  // Password too short
                role: 'user',
                phoneNumber: '+1234567890',
                dob: '2010-01-01',  // Too young
                gender: 'male',
                pronouns: 'he/him',
                country: 'USA',
                tShirtSize: 'M',
                dietaryRestrictions: 'none',
                school: 'Sample University',
                hackathonsAttended: 5,
                mlhCodeOfConduct: true,
                mlhPrivacyPolicy: true,
                mlhEmails: false
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Validation errors occurred');
        expect(res.body.errors.length).toBeGreaterThan(0);  // There should be validation errors
    });

    it('should return 400 if email already exists', async () => {
        // Mock the repository method to simulate a user already existing
        UserRepo.findByEmail.mockResolvedValue({
            id: 1,
            email: 'test@example.com'
        });

        const res = await request(app)
            .post('/register')
            .send({
                email: 'test@example.com',  // Existing email
                firstName: 'John',
                lastName: 'Doe',
                password: 'strongpassword123',
                role: 'user',
                phoneNumber: '+1234567890',
                dob: '2000-01-01',
                gender: 'male',
                pronouns: 'he/him',
                country: 'USA',
                tShirtSize: 'M',
                dietaryRestrictions: 'none',
                school: 'Sample University',
                hackathonsAttended: 5,
                mlhCodeOfConduct: true,
                mlhPrivacyPolicy: true,
                mlhEmails: false
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Email is already in use please sign in');
        expect(UserRepo.findByEmail).toHaveBeenCalledTimes(1);
    });
});
