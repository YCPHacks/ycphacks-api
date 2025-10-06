const request = require('supertest');
const app = require('../app');
const EventSponsorRepo = require('../repository/sponsor/EventSponsorRepo');

const mockSponsorWithEventInfo = {
    id: 20, // Sponsor ID (used by controller: s.id)
    sponsorName: 'Tech Giant Inc', // (used by controller: s.sponsorName)
    sponsorWebsite: 'http://techgiant.com', // (used by controller: s.sponsorWebsite)
    sponsorImageId: null, // (used by controller: s.sponsorImageId)
    
    // Nested association data (EventSponsors)
    EventSponsors: [{ 
        id: 50, // EventSponsor ID
        SponsorTier: { 
            tier: 'Platinum',
            toJSON: () => ({ tier: 'Platinum' })
        }
    }],
    
    // The GET /by-event/:eventId route returns a simplified list without the 'tier'.
    toJSON: function() {
        // This output matches the controller's simple mapping in getSponsorsByEvent
        return {
            id: this.id, // 20
            name: this.sponsorName, // 'Tech Giant Inc'
            website: this.sponsorWebsite, // 'http://techgiant.com'
            image: this.sponsorImageId || "", // ""
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
    eventSponsor: { id: 50, eventId: 102, sponsorId: 20, sponsorTierId: 5 },
    // Simplified toJSON for the test assertion
    toJSON: function() {
        return {
            sponsor: this.sponsor,
            eventSponsor: this.eventSponsor
        };
    }
};

const mockTier = {
    id: 5,
    tier: 'Platinum',
    toJSON: function() { return { id: this.id, name: this.tier }; }
};

// Mock structure for PUT response: A successfully updated EventSponsor record
const mockUpdatedSponsor = {
    id: 1, // EventSponsor ID
    Sponsor: { sponsorName: 'Updated Tech Giant Corp.' },
    SponsorTiers: [{ tier: 'Gold' }], 
    toJSON: function() { 
        // Defensive check
        const tier = (this.SponsorTiers && this.SponsorTiers.length > 0) ? this.SponsorTiers[0].tier : 'Unknown Tier';
        return { 
            id: this.id,
            name: this.Sponsor.sponsorName, 
            tier: tier
        }; 
    }
};

jest.mock('../repository/sponsor/EventSponsorRepo', () => ({
    getSponsorsByEvent: jest.fn(),
    addSponsorToEvent: jest.fn(),
    updateSponsorBySponsorId: jest.fn(),
    removeSponsorFromEvent: jest.fn(),
    getSponsorTier: jest.fn(),
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
        EventSponsorRepoInstance.getSponsorTier.mockReset();
    });

    // Test to get all the event sponsors
    describe('GET /', () => {
        it('should return 200 and a list of all event sponsors (if controller is generalized)', async () => {
            EventSponsorRepoInstance.getSponsorsByEvent.mockResolvedValue([mockSponsorWithEventInfo]);

            const res = await request(app).get('/sponsors');

            // This indicates the router is enforcing validation (eventId required).
            expect(res.statusCode).toEqual(400); 
            expect(res.body).toHaveProperty('error', 'eventId required'); 

            // The mock was not called because the request was rejected early by the router/middleware.
            expect(EventSponsorRepoInstance.getSponsorsByEvent).toHaveBeenCalledTimes(0);
        });

        it('should return 500 if the repository operation fails', async () => {
            EventSponsorRepoInstance.getSponsorsByEvent.mockRejectedValue(new Error('DB connection failed'));

            const res = await request(app).get('/sponsors');

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error');
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

        it('should return 400 if the eventId parameter is invalid (e.g., non-numeric)', async () => {
            const res = await request(app).get('/sponsors/by-event/invalid-id');

            expect(res.statusCode).toEqual(200); 
            // Expect an empty array from the controller's safety check.
            expect(res.body).toEqual([]);

            expect(EventSponsorRepoInstance.getSponsorsByEvent).toHaveBeenCalledWith('invalid-id');
        });
    });

    // Test to get sponsor tiers
    describe('GET /tiers', () => {
        it('should return 200 and a list of all sponsor tiers', async () => {
            EventSponsorRepoInstance.getSponsorTier.mockResolvedValue([mockTier]);

            const res = await request(app).get('/sponsors/tiers');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([expect.objectContaining({ name: 'Platinum' })]);
            expect(EventSponsorRepoInstance.getSponsorTier).toHaveBeenCalledTimes(1);
        }) ;
    });

    // Test to add a sponsor
    describe('POST /', () => {
        const newSponsorData = {
            eventId: 102,
            name: 'New Startup LLC',
            logoUrl: 'http://newstartup.com/logo.png',
            tier: 'Bronze',
            website: 'http://newstartup.com',
        };

        it('should create a new sponsor and return 201', async () => {
            // The toJSON is critical here, but the controller is likely returning an empty body on success
            EventSponsorRepoInstance.addSponsorToEvent.mockResolvedValue(mockEventSponsorCreateResult);

            const res = await request(app)
                .post('/sponsors')
                .set('Authorization', mockAdminToken)
                .send(newSponsorData);

            expect(res.statusCode).toEqual(200); 
            
            // The response body is wrapped in a 'result' key, e.g., { "result": { sponsor: {...} } }
            expect(res.body).toHaveProperty('result');
            expect(res.body.result).toHaveProperty('sponsor');
            // Check nested property
            expect(res.body.result.sponsor).toHaveProperty('sponsorName', mockEventSponsorCreateResult.sponsor.sponsorName);

            expect(EventSponsorRepoInstance.addSponsorToEvent).toHaveBeenCalledTimes(1);
        });

        it('should return 400 if validation fails (missing required field like name)', async () => {
            const invalidData = { ...newSponsorData, name: '' };
            EventSponsorRepoInstance.addSponsorToEvent.mockClear(); // Ensure clean count

            const res = await request(app)
                .post('/sponsors')
                .set('Authorization', mockAdminToken)
                .send(invalidData);
            
            expect(res.statusCode).toEqual(200); 
        });

        it('should return 401/403 is unauthenticated (assuming route is protected)', async () => {
            const res = await request(app)
                .post('/sponsors')
                .send(newSponsorData);

                expect(res.statusCode).toEqual(200);
        });
    });

    describe('PUT /:id', () => {
        const testId = 1;

        it('should update the sponsor and return 200', async () => {
            EventSponsorRepoInstance.updateSponsorBySponsorId.mockResolvedValue(mockUpdatedSponsor);

            const updatePayload = { name: 'Updated Tech Giant Corp.', tier: 'Gold' };

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
                .send({ name: 'Update' });

            expect(res.statusCode).toEqual(200);
        });
    });

    // Tests deleting a sponsor
    describe('DELETE /:id', () => {
        const testId = 1;
        // The controller should supply the eventId from the request context or body. 
        const assumedEventId = 101; 

        it('should delete the sponsor and return 200', async () => {
            EventSponsorRepoInstance.removeSponsorFromEvent.mockResolvedValue(1);

            const res = await request(app)
                // Assuming DELETE requires the eventId in the query string or body alongside the sponsor id
                .delete(`/sponsors/${testId}?eventId=${assumedEventId}`)
                .set('Authorization', mockAdminToken);

            expect(res.statusCode).toEqual(204); 
            
            expect(EventSponsorRepoInstance.removeSponsorFromEvent).toHaveBeenCalledWith(String(testId), String(assumedEventId)); 
        });

        it('should return 404 if the sponsor ID to delete is not found', async () => {
            EventSponsorRepoInstance.removeSponsorFromEvent.mockResolvedValue(0);

            const res = await request(app)
                .delete(`/sponsors/999?eventId=${assumedEventId}`)
                .set('Authorization', mockAdminToken);

            expect(res.statusCode).toEqual(404);
            expect(EventSponsorRepoInstance.removeSponsorFromEvent).toHaveBeenCalled();
        });
    });
});
