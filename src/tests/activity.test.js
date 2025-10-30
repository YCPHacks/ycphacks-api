const request = require('supertest');
const app = require('../app');  // Import your Express app
const EventRepo = require('../repository/event/EventRepo');

// Mock the EventRepo to avoid actual database interaction
jest.mock('../repository/event/EventRepo');

// Mock event so we have one in memory
const mockEvent = {
    id: 1,
    eventName: 'An event',
    startDate: '9999-01-01 12:00:00',
    endDate: '9999-01-03 12:00:00',
    canChange: false,
    year: 2025
}

const validActivityCreateRequest = {
    activityName: 'An activity',
    activityDate: '9999-01-01T01:00:00Z',
    activityDescription: 'A description about the activity',
    eventId: 1
};

describe('POST /activity/', () => {
    beforeEach(() => {
        // Reset mock calls before each test
        EventRepo.createActivity.mockReset();
        EventRepo.findActivityById.mockReset();
        jest.restoreAllMocks();
        EventRepo.findEventById.mockResolvedValue(mockEvent);
    });

    it('creates a new activity and return 201', async () => {
        EventRepo.findActivityById.mockResolvedValue(null); // no existing activity

        const mockActivity = {
            ...validActivityCreateRequest,
            toJSON: function() { return this; } // Sequelize-like behavior
        };

        EventRepo.createActivity.mockResolvedValue(mockActivity);

        // Act: send the HTTP request
        const res = await request(app)
            .post('/event/activity/')
            .send({
                ...validActivityCreateRequest
            });

        // Assert: response checks
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Activity created successfully');

        // Assert: verify mocks were called correctly
        expect(EventRepo.createActivity).toHaveBeenCalledTimes(1);
        expect(EventRepo.createActivity).toHaveBeenCalledWith(expect.objectContaining({
            ...validActivityCreateRequest,
            activityDate: validActivityCreateRequest.activityDate
        }));
    });

    it('returns 400 (no name)', async () => {
        // Act: send the HTTP request
        const res = await request(app)
            .post('/event/activity/')
            .send({
                ...validActivityCreateRequest,
                activityName: ''
            });

        // Assert: response checks
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Validation errors occurred');
        expect(Object.keys(res.body.errors).length).toEqual(1);  // There should be exactly one validation error
        expect(res.body.errors.activityName).toEqual('Name is required');
    });

    it('returns 400 (name too long)', async () => {
        // Act: send the HTTP request
        const res = await request(app)
            .post('/event/activity/')
            .send({
                ...validActivityCreateRequest,
                activityName: 'a'.repeat(256)
            });

        // Assert: response checks
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Validation errors occurred');
        expect(Object.keys(res.body.errors).length).toEqual(1);  // There should be exactly one validation error
        expect(res.body.errors.activityName).toEqual('Name must be less than 256 characters');
    });

    it('returns 400 (no date)', async () => {
        // Act: send the HTTP request
        const res = await request(app)
            .post('/event/activity/')
            .send({
                ...validActivityCreateRequest,
                activityDate: null
            });

        // Assert: response checks
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Validation errors occurred');
        expect(Object.keys(res.body.errors).length).toEqual(1);  // There should be exactly one validation error
        expect(res.body.errors.activityDate).toEqual('Date is required');
    });

    it('returns 400 (invalid date)', async () => {
        // Act: send the HTTP request
        const res = await request(app)
            .post('/event/activity/')
            .send({
                ...validActivityCreateRequest,
                activityDate: '9999-01-01 01:00:00'
            });

        // Assert: response checks
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Validation errors occurred');
        expect(Object.keys(res.body.errors).length).toEqual(1);  // There should be exactly one validation error
        expect(res.body.errors.activityDate).toEqual('Invalid date format (expecting: YYYY-MM-DD hh:mm:ss AM/PM)');
    });

    it('returns 400 (date in past)', async () => {
        // Act: send the HTTP request
        const res = await request(app)
            .post('/event/activity/')
            .send({
                ...validActivityCreateRequest,
                activityDate: '2000-01-01T01:00:00Z'
            });

        // Assert: response checks
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Validation errors occurred');
        expect(Object.keys(res.body.errors).length).toEqual(1);  // There should be exactly one validation error
        expect(res.body.errors.activityDate).toEqual('Date cannot be in the past');
    });

    it('returns 400 (description too long)', async () => {
        // Act: send the HTTP request
        const res = await request(app)
            .post('/event/activity/')
            .send({
                ...validActivityCreateRequest,
                activityDescription: 'a'.repeat(256)
            });

        // Assert: response checks
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Validation errors occurred');
        expect(Object.keys(res.body.errors).length).toEqual(1);  // There should be exactly one validation error
        expect(res.body.errors.activityDescription).toEqual('Description must be less than 256 characters');
    });

    it('returns 400 (no event id)', async () => {
        // Act: send the HTTP request
        const res = await request(app)
            .post('/event/activity/')
            .send({
                ...validActivityCreateRequest,
                eventId: 0
            });

        // Assert: response checks
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Validation errors occurred');
        expect(Object.keys(res.body.errors).length).toEqual(1);  // There should be exactly one validation error
        expect(res.body.errors.eventId).toEqual('Event ID is required');
    });
});
