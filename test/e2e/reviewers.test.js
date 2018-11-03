const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();
const { ResourceHelper } = require('../util/helpers');
const { dropCollection } = require('../util/db');
const Reviewer = require('../../lib/models/Reviewer');
const bcrypt = require('bcrypt');

const checkStatus = statusCode => res => {
    expect(res.status).toEqual(statusCode);
};

const checkOk = res => checkStatus(200)(res);

describe('end to end reviewer testing', () => {

    const rh = new ResourceHelper;

    // beforeEach(() => rh.wrapper('reviewers', 3));
    
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

    it('this creates a reviewer', () => {
        const reviewer = {
            name: chance.name(),
            company: chance.company(),
            password: 'alchemy123'
        };
        return request(app)
            .post('/reviewer')
            .send(reviewer)
            .then(({ body }) => {
                expect(body).toEqual({
                    ...reviewer,
                    _id: expect.any(String),
                    __v: expect.any(Number)
                });
            });
    });

    it('gets all reviewers', () => {
        return request(app)
            .get('/reviewer')
            .then(retrievedReviewers => {
                rh.createdReviewers.forEach(createdReviewer => {
                    expect(retrievedReviewers.body).toContainEqual({ _id: createdReviewer._id, name: createdReviewer.name, company: createdReviewer.company });
                });
            });
    });

    it('gets a reviewer by id', () => {
        return request(app)
            .get(`/reviewer/${rh.createdReviewers[0]._id}`)
            .then(({ body }) => expect(body).toEqual({ 
                _id: rh.createdReviewers[0]._id, 
                name: rh.createdReviewers[0].name, 
                company: rh.createdReviewers[0].company,
                reviews: expect.any(Object)
            }));
    });

    it('updates a reviewer', () => {

        const newReviewer = {
            name: chance.name(),
            company: chance.company()
        };

        return request(app)
            .put(`/reviewer/${rh.createdReviewers[0]._id}`)
            .send(newReviewer)
            .then(({ body }) => expect(body).toEqual({ _id: expect.any(String), name: newReviewer.name, company: newReviewer.company }));
    }); 
});
