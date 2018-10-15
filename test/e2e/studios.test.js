const { dropCollection } = require('../util/db');
const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();
const { StudioHelper } = require('../util/helpers');

describe('end to end studo testing', () => {

    const studioHelper = new StudioHelper;

    studioHelper.init();

    beforeEach(() => {
        return dropCollection('studios');
    });

    beforeEach(() => {
        return studioHelper.taskRunner();
    });

    it('this creates a studio', () => {
        const studio = {
            name: chance.name(),
            address: {
                city: chance.city(),
                state: chance.state(),
                country: chance.country({ full: true })
            }
        };
        return request(app)
            .post('/studios')
            .send(studio)
            .then(({ body }) => {
                expect(body).toEqual({
                    ...studio,  
                    _id: expect.any(String),
                    __v: expect.any(Number),
                });
            });
    });

    it('gets all studios', () => {
        return request(app)
            .get('/studios')
            .then(retrievedStudios => {
                studioHelper.createdStudios.forEach(createdStudio => {
                    expect(retrievedStudios.body).toContainEqual({ _id: createdStudio._id, name: createdStudio.name });
                });
            });
    });

    it('gets a studio by id', () => {
        return request(app)
            .get(`/studios/${studioHelper.createdStudios[0]._id}`)
            .then(({ body }) => expect(body).toEqual({ ...studioHelper.createdStudios[0] }));
    });

    it('deletes a studio by id', () => {
        return request(app)
            .delete(`/studios/${studioHelper.createdStudios[0]._id}`)
            .then(({ body }) => expect(body).toEqual({ removed: true }));
    });

    

});
