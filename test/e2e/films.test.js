const { dropCollection } = require('../util/db');
const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();

describe('end to end film testing', () => {

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
    let studios = [
        {
            name: chance.name(),
            address: {
                city: chance.city(),
                state: chance.state(),
                country: chance.country({ full: true })
            }
        },
        {
            name: chance.name(),
            address: {
                city: chance.city(),
                state: chance.state(),
                country: chance.country({ full: true })
            }
        },
        {
            name: chance.name(),
            address: {
                city: chance.city(),
                state: chance.state(),
                country: chance.country({ full: true })
            }
        }
    ];

    let createdActors;
    let createdStudios;


    const actingSchool = actor => {
        return request(app)
            .post('/actors')
            .send(actor)
            .then(res => res.body);
    };
    const studioMaker = studio => {
        return request(app)
            .post('/studios')
            .send(studio)
            .then(res => res.body);
    };

    beforeEach(() => {
        return dropCollection('actors');
    });
    beforeEach(() => {
        return dropCollection('studios');
    });

    beforeEach(() => {
        return Promise.all(actors.map(actingSchool))
            .then(actorRes => createdActors = actorRes);
    });
    beforeEach(() => {
        return Promise.all(studios.map(studioMaker))
            .then(studioRes => createdStudios = studioRes);
    });


    it('this creates a film', () => {

        // const studio = createdStudios[0];

        // const actor = createdActors[0];
        const film = {
            title: chance.word(),
            studio: createdStudios[0]._id,
            released: chance.natural({ min: 1900, max: 2050 }),
            cast: [{
                actor: createdActors[0]._id,
                role: chance.name()
            }]
        };

        return request(app)
            .post('/films')
            .send(film)
            .then(({ body }) => {
                expect(body).toEqual({
                    ...film,
                    cast: [{
                        ...film.cast[0],
                        _id: expect.any(String)
                    }],
                    _id: expect.any(String),
                    __v: expect.any(Number)
                });
            });
    });


});

