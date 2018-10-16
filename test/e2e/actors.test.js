const { dropCollection } = require('../util/db');
const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();
const { ResourceHelper } = require('../util/helpers');

describe('end to end actor testing', () => {

    const resourceHelper = new ResourceHelper;

    resourceHelper.init('actors', 3);
    beforeEach(() => dropCollection('actors'));
    beforeEach(() => resourceHelper.taskRunner('actor'));

    it('gets all actors', () => {
        return request(app)
            .get('/actors')
            .then(({ body }) => {
                resourceHelper.createdActors.forEach(createdActor => {
                    expect(body).toContainEqual({ _id: createdActor._id, name: createdActor.name });
                });
            });
    });

    it('gets an actor by id', () => {
        return request(app)
            .get(`/actors/${resourceHelper.createdActors[0]._id}`)
            .then(({ body }) => expect(body).toEqual(resourceHelper.createdActors[0]));
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
            .put(`/actors/${resourceHelper.createdActors[0]._id}`)
            .send(newActor)
            .then(({ body }) => expect(body).toEqual({ _id: expect.any(String), name: newActor.name }));
    });

    it('deletes an actor', () => {
        return request(app)
            .delete(`/actors/${resourceHelper.createdActors[0]._id}`)
            .then(({ body }) => expect(body).toEqual({ removed: true }));
    });



});
