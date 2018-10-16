const { dropCollection } = require('../util/db');
const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();
const { ResourceHelper } = require('../util/helpers');

describe('end to end review testing', () => {

    const resourceHelper = new ResourceHelper;

    beforeEach(() => {
        return (async() => {
            await resourceHelper.init('reviews', 104);
            await resourceHelper.init('reviewers', 2);
            await resourceHelper.init('films', 2);
            await resourceHelper.init('studios', 2);
            await resourceHelper.init('actors', 2);
            await dropCollection('reviewers');
            await dropCollection('films');
            await dropCollection('actors');
            await dropCollection('studios');
            await dropCollection('reviews');
            await resourceHelper.taskRunner('actor');
            await resourceHelper.taskRunner('reviewer')
                .then(() => resourceHelper.reviews.forEach((review, index) => {
                    review.reviewer = resourceHelper.createdReviewers[index % 2]._id;
                }));
            await resourceHelper.taskRunner('actor')
                .then(() => resourceHelper.createdActors.forEach((actor, index) => {
                    resourceHelper.films[index].cast[0].actor = actor;
                }));
            await resourceHelper.taskRunner('studio')
                .then(() => resourceHelper.createdStudios.forEach((studio, index) => {
                    resourceHelper.films[index].studio = studio;
                }));
            await resourceHelper.taskRunner('film')
                .then(() => resourceHelper.reviews.forEach((review, index) => {
                    review.film = resourceHelper.createdFilms[index % 2]._id;
                }));
            await resourceHelper.taskRunner('review');
        })();
    });

    it('this creates a review', () => {
        const review = {
            rating: chance.natural({ min: 1, max: 5 }),
            review: chance.string({ length: 50 }),
            reviewer: resourceHelper.createdReviewers[0]._id,
            film: resourceHelper.createdFilms[0]._id
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
                    _id: resourceHelper.createdReviews[100]._id, 
                    review: resourceHelper.createdReviews[100].review, 
                    rating: resourceHelper.createdReviews[100].rating,
                    film: {
                        _id: resourceHelper.createdReviews[100].film,
                        title: resourceHelper.createdFilms[0].title
                    }
                });
                expect(body).toContainEqual({ 
                    _id: resourceHelper.createdReviews[101]._id, 
                    review: resourceHelper.createdReviews[101].review, 
                    rating: resourceHelper.createdReviews[101].rating,
                    film: {
                        _id: resourceHelper.createdReviews[101].film,
                        title: resourceHelper.createdFilms[1].title
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


