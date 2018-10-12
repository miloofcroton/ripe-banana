const { dropCollection } = require('../util/db');
const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();

describe('end to end actor testing', () => {

    let actors = [
        {
            name: chance.name(),
            dob: chance.birthday(),
            pob: chance.city()
        },
        {
            name: chance.name(),
            dob: chance.birthday(),
            pob: chance.city()
        },
        {
            name: chance.name(),
            dob: chance.birthday(),
            pob: chance.city()
        },
    ];

    let createdActors;

    const actingSchool = actor => {
        return request(app)
            .post('/actors')
            .send(actor)
            .then(res => res.body);
    };

    beforeEach(() => {
        return dropCollection('actors');
    });

    beforeEach(() => {
        return Promise.all(actors.map(actingSchool))
            .then(actorRes => createdActors = actorRes);
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

    it('gets all actors', () => {
        return request(app)
            .get('/actors')
            .then(retrievedActors => {
                createdActors.forEach(createdActor => {
                    expect(retrievedActors.body).toContainEqual(createdActor);
                });
            });
    });

    

});
