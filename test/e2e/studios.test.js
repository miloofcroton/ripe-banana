const { dropCollection } = require('../util/db');
const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();
const { ResourceHelper } = require('../util/helpers');

describe('end to end studo testing', () => {

    const resourceHelper = new ResourceHelper;

    resourceHelper.init('studios', 3);

    beforeEach(() => {
        return dropCollection('studios');
    });

    beforeEach(() => {
        return resourceHelper.taskRunner('studio');
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
        console.log('test');
        return request(app)
            .get('/studios')
            .then(({ body }) => {
                resourceHelper.createdStudios.forEach(createdStudio => {
                    expect(body).toContainEqual({ _id: createdStudio._id, name: createdStudio.name });
                });
            });
    });

    it('gets a studio by id', () => {
        return request(app)
            .get(`/studios/${resourceHelper.createdStudios[0]._id}`)
            .then(({ body }) => expect(body).toEqual({ ...resourceHelper.createdStudios[0] }));
    });

    it('deletes a studio by id', () => {
        return request(app)
            .delete(`/studios/${resourceHelper.createdStudios[0]._id}`)
            .then(({ body }) => expect(body).toEqual({ removed: true }));
    });

    

});
