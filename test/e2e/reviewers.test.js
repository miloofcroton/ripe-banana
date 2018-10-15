const { dropCollection } = require('../util/db');
const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();

describe('end to end reviewer testing', () => {

    let reviewers = [
        {
            name: chance.name(),
            company: chance.company()
        },
        {
            name: chance.name(),
            company: chance.company()
        },
        {
            name: chance.name(),
            company: chance.company()
        },
    ];

    let createdReviewers;

    const tumblr = reviewer => {
        return request(app)
            .post('/reviewer')
            .send(reviewer)
            .then(res => res.body);
    };


    beforeEach(() => {
        return dropCollection('reviewers');
    });

    beforeEach(() => {
        return Promise.all(reviewers.map(tumblr))
            .then(reviewerRes => createdReviewers = reviewerRes);
    });
    
    it('this creates a reviewer', () => {
        const reviewer = {
            name: chance.name(),
            company: chance.company()
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
                createdReviewers.forEach(createdReviewer => {
                    expect(retrievedReviewers.body).toContainEqual({ _id: createdReviewer._id, name: createdReviewer.name, company: createdReviewer.company });
                });
            });
    });

    it('gets a reviewer by id', () => {
        return request(app)
            .get(`/reviewer/${createdReviewers[0]._id}`)
            .then(({ body }) => expect(body).toEqual({ _id: createdReviewers[0]._id, name: createdReviewers[0].name, company: createdReviewers[0].company }));
    });

    it('updates a reviewer', () => {

        const newReviewer = {
            name: chance.name(),
            company: chance.company()
        };

        return request(app)
            .put(`/reviewer/${createdReviewers[0]._id}`)
            .send(newReviewer)
            .then(({ body }) => expect(body).toEqual({ _id: expect.any(String), name: newReviewer.name, company: newReviewer.company }));



    });
    
});
