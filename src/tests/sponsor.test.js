const request = require('supertest');
const app = require('../app');
const EventSponsorRepo = require('../repository/sponsor/EventSponsorRepo');

jest.mock('../util/JWTUtil', () => ({
    // This function replaces the real authMiddleware with one that simply calls next(), 
    // simulating a successful authentication check.
    authMiddleware: (req, res, next) => {
        req.user = { id: 101, role: 'staff' }; 
        next();
    },
}), { virtual: true });

// --- MOCK DATA ---

const mockSponsorWithEventInfo = {
    id: 20, // Sponsor ID
    sponsorName: 'Tech Giant Inc',
    sponsorWebsite: 'http://techgiant.com',
    sponsorImageId: null,
    
    // Nested association data for getEventSponsors route
    EventSponsors: [{ 
        id: 50, 
        SponsorTier: { 
            tier: 'Platinum',
            toJSON: () => ({ tier: 'Platinum' })
        }
    }],
    
    // toJSON for the GET /by-event/:eventId route
    toJSON: function() {
        return {
            id: this.id,
            name: this.sponsorName,
            website: this.sponsorWebsite,
            image: this.sponsorImageId || "",
        };
    },

    // toJSON for the /sponsors?eventId=X route (which requires tier and image)
    toJSONWithTier: function() {
        const eventSponsor = this.EventSponsors?.[0];
        const tier = eventSponsor?.SponsorTier?.tier || "";
        return {
            id: this.id, 
            name: this.sponsorName,
            website: this.sponsorWebsite,
            image: this.sponsorImageId || "",
            tier: tier,
        };
    }
};

const mockEventSponsorCreateResult = {
    sponsor: { id: 20, sponsorName: 'New Startup LLC', sponsorWebsite: 'http://newstartup.com', },
    eventSponsor: { id: 50, eventId: 123, sponsorId: 20, sponsorTierId: 5 },
    toJSON: function() {
        return {
            sponsor: this.sponsor,
            eventSponsor: this.eventSponsor
        };
    }
};

const mockTierData = {
    id: 5,
    tier: 'Platinum',
    lowerThreshold: 1000,
    width: 200,
    height: 100,
};

// FIX: Redefining mockTier to include 'dataValues' for robust Sequelize simulation.
const mockTier = {
    ...mockTierData, // Provides direct property access (tier.tier)
    dataValues: mockTierData, // Provides Sequelize internal access (tier.dataValues.tier)
    toJSON: function() { 
        // This simulates the ORM data being processed, mapping 'tier' to 'name' 
        // and including all properties expected by the client or subsequent logic.
        return { 
            id: this.id, 
            name: this.tier,
            lowerThreshold: this.lowerThreshold, 
            width: this.width, 
            height: this.height 
        }; 
    }
};
const mockUpdatedSponsor = {
    id: 1, // EventSponsor ID
    Sponsor: { sponsorName: 'Updated Tech Giant Corp.' },
    SponsorTiers: [{ tier: 'Gold' }], 
    toJSON: function() { 
        const tier = (this.SponsorTiers && this.SponsorTiers.length > 0) ? this.SponsorTiers[0].tier : 'Unknown Tier';
        return { 
            id: this.id,
            name: this.Sponsor.sponsorName, 
            tier: tier
        }; 
    }
};

// --- MOCK REPOSITORY ---

jest.mock('../repository/sponsor/EventSponsorRepo', () => ({
    getSponsorsByEvent: jest.fn(),
    addSponsorToEvent: jest.fn(),
    updateSponsorBySponsorId: jest.fn(),
    removeSponsorFromEvent: jest.fn(),
    getSponsorTiers: jest.fn(),
}), { virtual: true });

// Mock the SponsorRepo used for deletion in the controller
jest.mock('../repository/sponsor/SponsorRepo', () => ({
    deleteSponsorById: jest.fn(),
}), { virtual: true });

const mockAdminToken = 'Bearer valid.admin.token';
const EventSponsorRepoInstance = EventSponsorRepo;

describe('Event Sponsor Routes', () => {
    beforeEach(() => {
        // Reset mock calls before each test
        EventSponsorRepoInstance.getSponsorsByEvent.mockReset();
        EventSponsorRepoInstance.addSponsorToEvent.mockReset();
        EventSponsorRepoInstance.updateSponsorBySponsorId.mockReset();
        EventSponsorRepoInstance.removeSponsorFromEvent.mockReset();
        EventSponsorRepoInstance.getSponsorTiers.mockReset();
        require('../repository/sponsor/SponsorRepo').deleteSponsorById.mockReset();
    });

    // Test to get all the event sponsors
    describe('GET /', () => {
        it('should return 400 if eventId query parameter is missing', async () => {
            const res = await request(app).get('/sponsors');
            expect(res.statusCode).toEqual(400); 
            expect(res.body).toHaveProperty('error', 'eventId required'); 
            expect(EventSponsorRepoInstance.getSponsorsByEvent).toHaveBeenCalledTimes(0);
        });

        it('should return 500 if the repository operation fails', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            // Mock the function to intentionally throw the error
            EventSponsorRepoInstance.getSponsorsByEvent.mockRejectedValue(new Error('DB connection failed'));

            const res = await request(app)
                .get('/sponsors?eventId=123');

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('error');
        
            consoleErrorSpy.mockRestore();
        });
    });

    // Test to get sponsors for an event
    describe('GET /by-event/:eventId', () => {
        const testEventId = 101;
        const expectedSponsor = mockSponsorWithEventInfo.toJSON(); 

        it('should return 200 and sponsors for a specific eventId', async () => {
            EventSponsorRepoInstance.getSponsorsByEvent.mockResolvedValue([mockSponsorWithEventInfo]);

            const res = await request(app).get(`/sponsors/by-event/${testEventId}`);
            expect(res.statusCode).toEqual(200); 
            expect(res.body).toEqual([expectedSponsor]);
            
            expect(EventSponsorRepoInstance.getSponsorsByEvent).toHaveBeenCalledWith(String(testEventId));
        });

        it('should return 200 and an empty array for an invalid eventId', async () => {
            EventSponsorRepoInstance.getSponsorsByEvent.mockResolvedValue([]); 
            
            const res = await request(app).get('/sponsors/by-event/invalid-id');

            expect(res.statusCode).toEqual(200); 
            expect(res.body).toEqual([]);
        });
    });

    // Test to get sponsor tiers
    describe('GET /tiers', () => {
        it('should return 200 and a list of all sponsor tiers', async () => {
            EventSponsorRepoInstance.getSponsorTiers.mockResolvedValue([mockTier]);

            const res = await request(app).get('/sponsors/tiers');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([expect.objectContaining({ name: 'Platinum' })]);
            expect(EventSponsorRepoInstance.getSponsorTiers).toHaveBeenCalledTimes(1);
        }) ;
    });

    // Test to add a sponsor (Protected Route)
    describe('POST /', () => {
        const newSponsorData = {
            eventId: 102,
            sponsorName: 'New Startup LLC',
            logoUrl: 'logo.png', 
            tier: 'Bronze',
            website: 'newstartup.com',
        };

        it('should create a new sponsor and return 201', async () => {
            // This test requires the auth mock to pass.
            EventSponsorRepoInstance.addSponsorToEvent.mockResolvedValue(mockEventSponsorCreateResult);

            const res = await request(app)
                .post('/sponsors')
                .set('Authorization', mockAdminToken) // Token required for protected route
                .send(newSponsorData);

            expect(res.statusCode).toEqual(201); // Controller now returns 201
            
            expect(res.body).toHaveProperty('result');
            expect(res.body.result).toHaveProperty('sponsor');

            expect(EventSponsorRepoInstance.addSponsorToEvent).toHaveBeenCalledTimes(1);
        });

        it('should return 400 if validation fails (missing required field like sponsorName)', async () => {
            const invalidData = { ...newSponsorData, sponsorName: '' }; 

            const res = await request(app)
                .post('/sponsors')
                .set('Authorization', mockAdminToken)
                .send(invalidData);
            
            expect(res.statusCode).toEqual(400);
            expect(EventSponsorRepoInstance.addSponsorToEvent).not.toHaveBeenCalled();
        });

        it('should return 400 if unauthenticated request fails validation', async () => {
            const invalidData = { ...newSponsorData, eventId: undefined };
            
            const res = await request(app)
                .post('/sponsors')
                .send(invalidData);

            expect(res.statusCode).toEqual(400); 
        });
    });

    describe('PUT /:id', () => {
        const testId = 1;

        it('should update the sponsor and return 200', async () => {
            EventSponsorRepoInstance.updateSponsorBySponsorId.mockResolvedValue(mockUpdatedSponsor);

            const updatePayload = { sponsorName: 'Updated Tech Giant Corp.', tier: 'Gold' }; 

            const res = await request(app)
                .put(`/sponsors/${testId}`)
                .set('Authorization', mockAdminToken)
                .send(updatePayload);

                expect(res.statusCode).toEqual(200);
                expect(res.body).toHaveProperty('name', 'Updated Tech Giant Corp.');
                
                expect(EventSponsorRepoInstance.updateSponsorBySponsorId).toHaveBeenCalledWith(String(testId), expect.objectContaining(updatePayload));
        });

        it('should return 404 if the sponsor ID is not found', async () => {
            EventSponsorRepoInstance.updateSponsorBySponsorId.mockResolvedValue(null);

            const res = await request(app)
                .put('/sponsors/999')
                .set('Authorization', mockAdminToken)
                .send({ sponsorName: 'Update' });

            expect(res.statusCode).toEqual(404);
        });
    });

    // Tests deleting a sponsor (Protected Route)
    describe('DELETE /:id', () => {
        const testId = 1;
        const assumedEventId = 101; 

        it('should delete the sponsor and return 204', async () => {
            // Mock both repository calls to simulate success
            EventSponsorRepoInstance.removeSponsorFromEvent.mockResolvedValue(1);
            require('../repository/sponsor/SponsorRepo').deleteSponsorById.mockResolvedValue(1);

            const res = await request(app)
                .delete(`/sponsors/${testId}?eventId=${assumedEventId}`)
                .set('Authorization', mockAdminToken);

            expect(res.statusCode).toEqual(204); 
            
            expect(EventSponsorRepoInstance.removeSponsorFromEvent).toHaveBeenCalledWith(String(testId), String(assumedEventId)); 
            expect(require('../repository/sponsor/SponsorRepo').deleteSponsorById).toHaveBeenCalledWith(String(testId));
        });

        it('should return 404 if the sponsor ID to delete is not found', async () => {
            EventSponsorRepoInstance.removeSponsorFromEvent.mockResolvedValue(0); // Not found

            const res = await request(app)
                .delete(`/sponsors/999?eventId=${assumedEventId}`)
                .set('Authorization', mockAdminToken); // Protected route requires token/mock

            expect(res.statusCode).toEqual(404);
        });
    });
});
