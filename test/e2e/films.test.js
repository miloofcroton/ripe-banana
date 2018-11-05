const { dropCollection } = require('../util/db');
const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();
const { ResourceHelper } = require('../util/helpers');
const { getReviewers, getReviewerTokens, getActors, getStudios, getFilms, getReviews } = require('./create');

describe('end to end film testing', () => {

    const rh = new ResourceHelper;

    beforeEach(() => {
        return (async() => {
            await Promise.all([dropCollection('films'), dropCollection('reviews')]);
            await Promise.all([rh.init('reviews', 104), rh.init('films', 104)]);

            await rh.wrapper('reviewers', 2);
            await rh.assign('reviews', 'createdReviewers', 'reviewer');

            await rh.wrapper('actors', 2);
            await rh.assign('films', 'createdActors', 'cast[0].actor');

            await rh.wrapper('studios', 2);
            await rh.assign('films', 'createdStudios', 'studio');

            await rh.taskRunner('films');
            await rh.assign('reviews', 'createdFilms', 'film');

            await rh.taskRunner('reviews');
        })();
    });

    it('this creates a film', () => {

        const reviewerTokens = getReviewerTokens();
        const studios = getStudios();
        const actors = getActors();

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
            .set('Authorization', `Bearer ${reviewerTokens[0]}`)
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
                    title: rh.createdFilms[0].title,
                    released: rh.createdFilms[0].released,
                    studio: { 
                        _id: rh.createdFilms[0].studio, 
                        name: rh.createdStudios[0].name 
                    },
                    cast: [{
                        _id: rh.createdFilms[0].cast[0]._id,
                        role: rh.createdFilms[0].cast[0].role,
                        actor: {
                            _id: rh.createdActors[0]._id,
                            name: rh.createdActors[0].name
                        }
                    }],
                    reviews: expect.any(Array)
                });
                expect(body.reviews).toContainEqual({ 
                    _id: rh.createdReviews[0]._id,
                    rating: rh.createdReviews[0].rating,
                    review: rh.createdReviews[0].review,
                    reviewer: { 
                        _id: rh.createdReviews[0].reviewer,
                        name: rh.createdReviewers[0].name
                    }
                });
            });
    });

    it('deletes a film by id if you are an admin', () => {
        const reviewerTokens = getReviewerTokens();
        const films = getFilms();
        const id = films[0]._id;

        return request(app)
            // .delete(`/films/${rh.createdFilms[0]._id}`)
            .delete(`/films/${id}`)
            .set('Authorization', `Bearer ${reviewerTokens[0]}`)
            .then(({ body }) => expect(body).toEqual({ removed: true }));
    });

});

