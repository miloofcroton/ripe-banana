const { dropCollection } = require('../util/db');
const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();
const { ResourceHelper } = require('../util/helpers');

describe('end to end review testing', () => {

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

    it('this creates a review', () => {
        const review = {
            rating: chance.natural({ min: 1, max: 5 }),
            review: chance.string({ length: 50 }),
            reviewer: rh.createdReviewers[0]._id,
            film: rh.createdFilms[0]._id
        };
        return request(app)
            .post('/reviews')
            .send(review)
            .then(({ body }) => {
                expect(body).toEqual({
                    ...review,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    _id: expect.any(String),
                    __v: expect.any(Number)
                });
            });
    });

    it('gets all reviews', () => {

        return request(app)
            .get('/reviews')
            .then(({ body }) => {
                expect(body).toContainEqual({ 
                    _id: rh.createdReviews[100]._id, 
                    review: rh.createdReviews[100].review, 
                    rating: rh.createdReviews[100].rating,
                    film: {
                        _id: rh.createdReviews[100].film,
                        title: rh.createdFilms[0].title
                    }
                });
                expect(body).toContainEqual({ 
                    _id: rh.createdReviews[101]._id, 
                    review: rh.createdReviews[101].review, 
                    rating: rh.createdReviews[101].rating,
                    film: {
                        _id: rh.createdReviews[101].film,
                        title: rh.createdFilms[1].title
                    }
                });
            });
    });

    it('gets only the 100 reviews', () => {

        return request(app)
            .get('/reviews')
            .then(({ body }) => {
                expect(body.length).toEqual(100);
            });
    });


});


