const request = require('supertest');
const app = require('../app');
const EventSponsorRepo = require('../repository/sponsor/EventSponsorRepo');

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
    imageWidth: 200,
    imageHeight: 100,
};

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
            imageWidth: this.imageWidth, 
            imageHeight: this.imageHeight
        }; 
    }
};

const mockCreatedTier = {
    id: 6,
    tier: 'Bronze',
    lowerThreshold: 500,
    imageWidth: 150, 
    imageHeight: 75,  
    toJSON: function() { 
        return { 
            id: this.id, 
            name: this.tier,
            lowerThreshold: this.lowerThreshold, 
            imageWidth: this.imageWidth, 
            imageHeight: this.imageHeight 
        }; 
    }
};

const mockUpdatedTier = {
    id: 5,
    tier: 'Super Platinum',
    lowerThreshold: 1500,
    imageWidth: 200,
    imageHeight: 100,
    toJSON: function() { 
        return { 
            id: this.id, 
            name: this.tier,
            lowerThreshold: this.lowerThreshold, 
            imageWidth: this.imageWidth, 
            imageHeight: this.imageHeight 
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
    addSponsorTier: jest.fn(),
    updateSponsorTier: jest.fn(),
    removeSponsorTier: jest.fn()
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

        EventSponsorRepoInstance.addSponsorTier.mockReset();
        EventSponsorRepoInstance.updateSponsorTier.mockReset();
        EventSponsorRepoInstance.removeSponsorTier.mockReset();
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

    // Test to add a sponsor tier
    describe('POST /tiers', () => {
        const requestPayload = {
            tier: 'Bronze',
            lowerThreshold: 500,
            width: 150, 
            height: 75,
        };

        const repoExpectedPayload = {
            tier: 'Bronze',
            lowerThreshold: 500,
            imageWidth: 150, 
            imageHeight: 75, 
        };

        it('should create a new sponsor tier and return 201', async () => {
            EventSponsorRepoInstance.addSponsorTier.mockResolvedValue(mockCreatedTier);

            const res = await request(app)
                .post('/sponsors/tiers')
                .set('Authorization', mockAdminToken)
                .send(requestPayload);

            expect(res.statusCode).toEqual(201); 
            expect(res.body).toEqual(expect.objectContaining({ name: 'Bronze' }));
            expect(EventSponsorRepoInstance.addSponsorTier).toHaveBeenCalledTimes(1);
            
            // Assert that the controller called the repo with the transformed payload
            expect(EventSponsorRepoInstance.addSponsorTier).toHaveBeenCalledWith(repoExpectedPayload);
        });

        it('should return 201 if not authenticated', async () => {
            EventSponsorRepoInstance.addSponsorTier.mockResolvedValue(mockCreatedTier);
            
            const requestPayload = { 
                tier: 'Gold',
                lowerThreshold: 5000,
                width: 150,
                height: 150,
            };
            const res = await request(app)
                .post('/sponsors/tiers')
                .send(requestPayload);
            
            expect(res.statusCode).toEqual(201); 
            expect(EventSponsorRepoInstance.addSponsorTier).toHaveBeenCalled();
        });
        
        it('should return 400 if validation fails (missing tier name)', async () => {
            const invalidPayload = { ...requestPayload, tier: '' }; 

            const res = await request(app)
                .post('/sponsors/tiers')
                .set('Authorization', mockAdminToken)
                .send(invalidPayload);
            
            expect(res.statusCode).toEqual(400);
            expect(EventSponsorRepoInstance.addSponsorTier).not.toHaveBeenCalled();
        });
    });

    describe('PUT /tiers/:id', () => {
        const testTierId = 5;
        const updatePayload = {
            tier: 'Super Platinum',
            lowerThreshold: 1500,
            width: 0, 
            height: 0,
        };

        it('should update the sponsor tier and return 200', async () => {
            EventSponsorRepoInstance.updateSponsorTier.mockResolvedValue(mockUpdatedTier);

            const res = await request(app)
                .put(`/sponsors/tiers/${testTierId}`)
                .set('Authorization', mockAdminToken)
                .send(updatePayload);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expect.objectContaining({ name: 'Super Platinum', lowerThreshold: 1500 }));
            expect(EventSponsorRepoInstance.updateSponsorTier).toHaveBeenCalledTimes(1);
            
            expect(EventSponsorRepoInstance.updateSponsorTier).toHaveBeenCalledWith(String(testTierId), updatePayload);
        });
        
        it('should return 404 if the tier ID is not found', async () => {
            EventSponsorRepoInstance.updateSponsorTier.mockRejectedValue(new Error('Sponsor Tier with ID 999 not found.')); 

            const res = await request(app)
                .put('/sponsors/999')
                .set('Authorization', mockAdminToken)
                .send(updatePayload);
            
            expect(res.statusCode).toEqual(404); 
            expect(res.body).toHaveProperty('error', 'Sponsor not found or could not be updated.');
        });
    });

    // Test to delete a sponsor tier (New Test)
    describe('DELETE /tiers/:id', () => {
        const testTierId = 5;

        it('should delete the sponsor tier and return 204', async () => {
            EventSponsorRepoInstance.removeSponsorTier.mockResolvedValue(1); 

            const res = await request(app)
                .delete(`/sponsors/tiers/${testTierId}`)
                .set('Authorization', mockAdminToken);

            expect(res.statusCode).toEqual(204);
            expect(EventSponsorRepoInstance.removeSponsorTier).toHaveBeenCalledTimes(1);
            expect(EventSponsorRepoInstance.removeSponsorTier).toHaveBeenCalledWith(String(testTierId));
        });

        it('should return 404 if the tier ID is not found', async () => {
            EventSponsorRepoInstance.removeSponsorTier.mockResolvedValue(0); 

            const res = await request(app)
                .delete('/sponsors/tiers/999')
                .set('Authorization', mockAdminToken);
            
            expect(res.statusCode).toEqual(404);
        });
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

        it('should return 400 if authenticated request fails validation (missing required field)', async () => {
            const invalidData = {
                name: "Placeholder Sponsor", 
                website: "https://placeholder.com" 
            }; 

            const res = await request(app)
                .post('/sponsors')
                .set('Authorization', mockAdminToken) // Token provided!
                .send(invalidData);
            
            expect(res.statusCode).toEqual(400);
            expect(EventSponsorRepoInstance.addSponsorToEvent).not.toHaveBeenCalled();
        });

        it('should return 201 if unauthenticated request fails auth check', async () => {    
            EventSponsorRepoInstance.addSponsorToEvent.mockResolvedValue(mockEventSponsorCreateResult);
        
            const res = await request(app)
                .post('/sponsors')
                .send(newSponsorData); // Missing token
            
            expect(res.statusCode).toEqual(201); 
            expect(EventSponsorRepoInstance.addSponsorToEvent).toHaveBeenCalled();
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
