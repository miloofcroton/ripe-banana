const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();
const { ResourceHelper } = require('../util/helpers');

describe('end to end actor testing', () => {

    const rh = new ResourceHelper;

    beforeEach(() => rh.wrapper('actors', 3));

    it('gets all actors', () => {
        return request(app)
            .get('/actors')
            .then(({ body }) => {
                rh.createdActors.forEach(createdActor => {
                    expect(body).toContainEqual({ _id: createdActor._id, name: createdActor.name });
                });
            });
    });

    it('gets an actor by id', () => {
        return request(app)
            .get(`/actors/${rh.createdActors[0]._id}`)
            .then(({ body }) => expect(body).toEqual(rh.createdActors[0]));
    });

    it('this creates an actor', () => {
        const actor = {
            name: chance.name(),
            dob: chance.birthday(),
            pob: chance.city()
        };
        return request(app)
            .post('/actors')
            .send(actor)
            .then(({ body }) => {
                expect(body).toEqual({
                    ...actor,
                    dob: actor.dob.toISOString(),
                    _id: expect.any(String),
                    __v: expect.any(Number)
                });
            });
    });

    it('updates an actor', () => {

        const newActor = {
            name: chance.name(),
            dob: chance.birthday(),
            pob: chance.city()
        };

        return request(app)
            .put(`/actors/${rh.createdActors[0]._id}`)
            .send(newActor)
            .then(({ body }) => expect(body).toEqual({ _id: expect.any(String), name: newActor.name }));
    });

    it('deletes an actor', () => {
        return request(app)
            .delete(`/actors/${rh.createdActors[0]._id}`)
            .then(({ body }) => expect(body).toEqual({ removed: true }));
    });
});
