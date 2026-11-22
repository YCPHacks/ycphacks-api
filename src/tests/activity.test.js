const request = require('supertest');
const app = require('../app');  // Import your Express app
const EventRepo = require('../repository/event/EventRepo');

const discordNotifier = require('../util/discordNotifier');

// Mock the EventRepo to avoid actual database interaction
jest.mock('../repository/event/EventRepo');
jest.mock('../util/discordNotifier');

const mockUser = { id: '1', role: 'oscar'}

// Mock the authMiddleware
jest.mock('../middleware/authMiddleware', () => ({
    authToken: jest.fn((req, res, next) => {
        req.user = mockUser;
        next();
    }),

    authorizeByRole: jest.fn((...roles) => (req, res, next) => {
        next();
    }),

    isOwnerOfRequestedId: jest.fn((req, res, next) => {
        next();
    })

}));

// Mock event so we have one in memory
const mockEvent = {
    id: 1,
    eventName: 'An event',
    startDate: '9999-01-01T12:00:00Z',
    endDate: '9999-01-03T12:00:00Z',
    canChange: false,
    year: 9999,
    isActive: false
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
        expect(res.body.errors.activityDate).toEqual('Invalid date format');
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

describe('Activity notifyDiscord', () => {
    beforeEach(() => {
        EventRepo.createActivity.mockReset();
        EventRepo.findActivityById.mockReset();
        EventRepo.updateActivity.mockReset();
        EventRepo.deleteActivity.mockReset();
        EventRepo.findEventById.mockResolvedValue(mockEvent);
        jest.clearAllMocks();
        discordNotifier.withActivityLock?.mockImplementation((id, task) => task());
    });

    it('defaults notifyDiscord to true on create', async () => {
        EventRepo.createActivity.mockImplementation(async (a) => ({ id: 1, ...a }));

        const res = await request(app).post('/event/activity/').send(validActivityCreateRequest);

        expect(res.statusCode).toEqual(201);
        expect(EventRepo.createActivity).toHaveBeenCalledWith(expect.objectContaining({ notifyDiscord: true }));
        expect(res.body.activity.notifyDiscord).toBe(true);
    });

    it('schedules the alert for a created activity', async () => {
        EventRepo.createActivity.mockImplementation(async (a) => ({ id: 1, ...a }));

        await request(app).post('/event/activity/').send(validActivityCreateRequest);

        expect(discordNotifier.scheduleActivity).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
    });

    it('cancels the alert for a deleted activity', async () => {
        EventRepo.findActivityById.mockResolvedValue({ id: 5 });
        EventRepo.deleteActivity.mockResolvedValue(1);

        const res = await request(app).delete('/event/activity/5');

        expect(res.statusCode).toEqual(200);
        expect(discordNotifier.cancelActivity).toHaveBeenCalledWith('5');
    });

    it('saves notifyDiscord false on create', async () => {
        EventRepo.createActivity.mockImplementation(async (a) => ({ id: 1, ...a }));

        const res = await request(app).post('/event/activity/').send({ ...validActivityCreateRequest, notifyDiscord: false });

        expect(res.statusCode).toEqual(201);
        expect(EventRepo.createActivity).toHaveBeenCalledWith(expect.objectContaining({ notifyDiscord: false }));
        expect(res.body.activity.notifyDiscord).toBe(false);
    });

    it('returns 400 when notifyDiscord is not a boolean', async () => {
        const res = await request(app).post('/event/activity/').send({ ...validActivityCreateRequest, notifyDiscord: 'yes' });

        expect(res.statusCode).toEqual(400);
        expect(Object.keys(res.body.errors).length).toEqual(1);
        expect(res.body.errors.notifyDiscord).toEqual('Notify Discord must be true or false');
    });

    const existing = {
        id: 5,
        ...validActivityCreateRequest,
        activityDate: new Date(validActivityCreateRequest.activityDate),
        notifyDiscord: true,
        discordNotifiedAt: new Date('9998-12-31T00:00:00Z')
    };

    it('resets discordNotifiedAt when the date changes', async () => {
        EventRepo.findActivityById.mockResolvedValue(existing);
        EventRepo.updateActivity.mockResolvedValue([1]);

        const res = await request(app).put('/event/activity').send({
            ...validActivityCreateRequest, id: 5, activityDate: '9999-01-01T02:00:00Z'
        });

        expect(res.statusCode).toEqual(200);
        expect(EventRepo.updateActivity).toHaveBeenCalledWith(expect.objectContaining({ discordNotifiedAt: null }));
        expect(discordNotifier.scheduleActivity).toHaveBeenCalledTimes(1);
    });

    it('leaves discordNotifiedAt alone when only the name changes', async () => {
        EventRepo.findActivityById.mockResolvedValue(existing);
        EventRepo.updateActivity.mockResolvedValue([1]);

        const res = await request(app).put('/event/activity').send({
            ...validActivityCreateRequest, id: 5, activityName: 'Renamed'
        });

        expect(res.statusCode).toEqual(200);
        expect(EventRepo.updateActivity.mock.calls[0][0]).not.toHaveProperty('discordNotifiedAt');
    });

    it('keeps the existing notifyDiscord when the edit omits it', async () => {
        EventRepo.findActivityById.mockResolvedValue({ ...existing, notifyDiscord: false });
        EventRepo.updateActivity.mockResolvedValue([1]);

        await request(app).put('/event/activity').send({ ...validActivityCreateRequest, id: 5 });

        expect(EventRepo.updateActivity).toHaveBeenCalledWith(expect.objectContaining({ notifyDiscord: false }));
    });

    it('accepts an identical save that MySQL counts as 0 rows changed', async () => {
        EventRepo.findActivityById.mockResolvedValue(existing);
        EventRepo.updateActivity.mockResolvedValue([0]);

        const res = await request(app).put('/event/activity').send({ ...validActivityCreateRequest, id: 5 });

        expect(res.statusCode).toEqual(200);
    });

    it('returns 404 when the activity is deleted during the edit', async () => {
        EventRepo.findActivityById.mockResolvedValueOnce(existing).mockResolvedValueOnce(null);
        EventRepo.updateActivity.mockResolvedValue([0]);

        const res = await request(app).put('/event/activity').send({ ...validActivityCreateRequest, id: 5 });

        expect(res.statusCode).toEqual(404);
    });

    it('saves an edit while holding that activity\'s notifier lock', async () => {
        EventRepo.findActivityById.mockResolvedValue(existing);
        EventRepo.updateActivity.mockResolvedValue([1]);

        await request(app).put('/event/activity').send({ ...validActivityCreateRequest, id: 5 });

        expect(discordNotifier.withActivityLock).toHaveBeenCalledWith(5, expect.any(Function));
    });
});

describe('POST /event/import', () => {
    const importCSV = (...rows) => request(app)
        .post('/event/import')
        .set('Content-Type', 'text/csv')
        .send(['activityName,activityDate,activityDescription,eventId', ...rows].join('\n'));

    beforeEach(() => {
        EventRepo.createActivity.mockReset();
        EventRepo.createActivity.mockResolvedValue({ id: 1 });
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('schedules the rows saved before a bad row', async () => {
        const res = await importCSV('Dinner,2026-11-22 19:00,Food,1', 'Broken,not a date,Food,1');

        expect(res.statusCode).toEqual(500);
        expect(EventRepo.createActivity).toHaveBeenCalledTimes(1);
        expect(discordNotifier.scheduleAll).toHaveBeenCalledTimes(1);
    });
});
