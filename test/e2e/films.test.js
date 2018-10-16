const { dropCollection } = require('../util/db');
const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();
const { ResourceHelper } = require('../util/helpers');

describe('end to end film testing', () => {

    const resourceHelper = new ResourceHelper;

    resourceHelper.init('actors', 2);
    resourceHelper.init('studios', 2);
    resourceHelper.init('films', 2);

    beforeEach(() => {
        return Promise.all([
            dropCollection('films'),
            dropCollection('actors'),
            dropCollection('studios'),
        ]);
    });

    beforeEach(() => {
        return resourceHelper.taskRunner('actor')
            .then(() => resourceHelper.createdActors.forEach((actor, index) => {
                resourceHelper.films[index].cast[0].actor = actor;
            }));
    });
    beforeEach(() => {
        return resourceHelper.taskRunner('studio')
            .then(() => resourceHelper.createdStudios.forEach((studio, index) => {
                resourceHelper.films[index].studio = studio;
            }));
    });

    beforeEach(() => {
        return resourceHelper.taskRunner('film');
    });

    it('this creates a film', () => {

        const film = {
            title: chance.word(),
            studio: resourceHelper.createdStudios[0]._id,
            released: chance.natural({ min: 1900, max: 2050 }),
            cast: [{
                actor: resourceHelper.createdActors[0]._id,
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
                resourceHelper.createdFilms.forEach(() => {
                    expect(retrievedFilms.body).toContainEqual({ 
                        title: resourceHelper.createdFilms[0].title,
                        studio: { _id: resourceHelper.createdFilms[0].studio, name: resourceHelper.createdStudios[0].name },
                        released: resourceHelper.createdFilms[0].released,
                        _id: expect.any(String),
                    });

                });
            });
    });

    it('gets a film by id', () => {
        return request(app)
            .get(`/films/${resourceHelper.createdFilms[0]._id}`)
            .then(({ body }) => {
                console.log(body);

                expect(body).toEqual({
                    _id: resourceHelper.createdFilms[0]._id,
                    title: resourceHelper.createdFilms[0].title,
                    released: resourceHelper.createdFilms[0].released,
                    studio: { _id: resourceHelper.createdFilms[0].studio, name: resourceHelper.createdStudios[0].name },
                    cast: [{
                        _id: resourceHelper.createdFilms[0].cast[0]._id,
                        role: resourceHelper.createdFilms[0].cast[0].role,
                        actor: {
                            _id: resourceHelper.createdActors[0]._id,
                            name: resourceHelper.createdActors[0].name
                        }
                    }],
                });
            });
    });

    it('deletes a film by id', () => {
        return request(app)
            .delete(`/films/${resourceHelper.createdFilms[0]._id}`)
            .then(({ body }) => expect(body).toEqual({ removed: true }));
    });

});

