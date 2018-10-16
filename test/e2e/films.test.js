const { dropCollection } = require('../util/db');
const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();
const { ResourceHelper } = require('../util/helpers');

describe('end to end film testing', () => {

    const rh = new ResourceHelper;

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

    it('this creates a film', () => {

        const film = {
            title: chance.word(),
            studio: rh.createdStudios[0]._id,
            released: chance.natural({ min: 1900, max: 2050 }),
            cast: [{
                actor: rh.createdActors[0]._id,
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
                rh.createdFilms.forEach(() => {
                    expect(retrievedFilms.body).toContainEqual({ 
                        title: rh.createdFilms[0].title,
                        studio: { _id: rh.createdFilms[0].studio, name: rh.createdStudios[0].name },
                        released: rh.createdFilms[0].released,
                        _id: expect.any(String),
                    });

                });
            });
    });

    it('gets a film by id', () => {
        return request(app)
            .get(`/films/${rh.createdFilms[0]._id}`)
            .then(({ body }) => {
                expect(body).toEqual({
                    _id: rh.createdFilms[0]._id,
                    title: rh.createdFilms[0].title,
                    released: rh.createdFilms[0].released,
                    studio: { _id: rh.createdFilms[0].studio, name: rh.createdStudios[0].name },
                    cast: [{
                        _id: rh.createdFilms[0].cast[0]._id,
                        role: rh.createdFilms[0].cast[0].role,
                        actor: {
                            _id: rh.createdActors[0]._id,
                            name: rh.createdActors[0].name
                        }
                    }],
                });
            });
    });

    it('deletes a film by id', () => {
        return request(app)
            .delete(`/films/${rh.createdFilms[0]._id}`)
            .then(({ body }) => expect(body).toEqual({ removed: true }));
    });

});

