const { dropCollection } = require('../util/db');
const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();

describe('end to end film testing', () => {

    let createdActors;
    let createdStudios;
    let createdFilms;

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
    ];
    let films = [{
        title: chance.word(),
        released: chance.natural({ min: 1900, max: 2050 }),
        cast: [{
            role: chance.name(),
        }]
    },
    {
        title: chance.word(),
        released: chance.natural({ min: 1900, max: 2050 }),
        cast: [{
            role: chance.name(),
        }]
    }];

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
    const filmProduction = film => {
        return request(app)
            .post('/films')
            .send(film)
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
            .then(actorRes => createdActors = actorRes)
            .then(() => createdActors.forEach((actor, index) => {
                films[index].cast[0].actor = actor;
            }));
    });
    beforeEach(() => {
        return Promise.all(studios.map(studioMaker))
            .then(studioRes => createdStudios = studioRes)
            .then(() => createdStudios.forEach((studio, index) => {
                films[index].studio = studio;
            }));
    });


    beforeEach(() => {
        return dropCollection('films');
    });
    beforeEach(() => {
        return Promise.all(films.map(filmProduction))
            .then(filmRes => createdFilms = filmRes);
    });


    it('this creates a film', () => {

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
                    cast: [{ ...film.cast[0], _id: expect.any(String) }],
                    _id: expect.any(String),
                    __v: expect.any(Number)
                });
            });
    });

    it('gets all films', () => {
        return request(app)
            .get('/films')
            .then(retrievedFilms => {
                console.log(retrievedFilms.body);
                createdFilms.forEach(createdFilm => {
                    expect(retrievedFilms.body).toContainEqual({ 
                        // ...createdFilms[0],
                        title: createdFilms[0].title,
                        studio: createdFilms[0].studio,
                        released: createdFilms[0].released,
                        _id: expect.any(String),
                    });

                });
            });
    });




});

