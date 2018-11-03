const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();
const { ResourceHelper } = require('../util/helpers');
const { dropCollection } = require('../util/db');
// const bcrypt = require('bcrypt');

describe('end to end studo testing', () => {

    const rh = new ResourceHelper;

    // beforeEach(() => rh.wrapper('studios', 3));

    beforeEach(() => {
        return (async() => {
            await dropCollection('films');
            await rh.init('films', 104);

            await rh.wrapper('actors', 2);
            await rh.assign('films', 'createdActors', 'cast[0].actor');

            await rh.wrapper('studios', 2);
            await rh.assign('films', 'createdStudios', 'studio');
            
            await rh.taskRunner('films');
        })();
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
                });
            });
    });

    it('gets all studios', () => {
        return request(app)
            .get('/studios')
            .then(({ body }) => {
                rh.createdStudios.forEach(createdStudio => {
                    expect(body).toContainEqual({ _id: createdStudio._id, name: createdStudio.name });
                });
            });
    });

    it('gets a studio by id', () => {
        return request(app)
            .get(`/studios/${rh.createdStudios[0]._id}`)
            .then(({ body }) => expect(body).toEqual({ ...rh.createdStudios[0], films: expect.any(Object) }));
    });

    it('deletes a studio by id', () => {
        
        let studio = {
            name: chance.name(),
            address: {
                city: chance.city(),
                state: chance.state(),
                country: chance.country({ full: true })
            }
        };

        return (async() => {

            await request(app)
                .post('/studios')
                .send(studio)
                .then(({ body }) => studio.id = body._id);
            await request(app)
                .delete(`/studios/${studio.id}`)
                .then(({ body }) => expect(body).toEqual({ removed: true }));

        })();
    });

    it('does not delete a studio if there are films', () => {
        return request(app)
            .delete(`/studios/${rh.createdStudios[0]._id}`)
            .then(({ body }) => expect(body).toEqual({ removed: false }));
    });
});
