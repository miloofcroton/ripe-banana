const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();
const { ResourceHelper } = require('../util/helpers');

describe('end to end reviewer testing', () => {

    const rh = new ResourceHelper;

    beforeEach(() => rh.wrapper('reviewers', 3));
    
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
                rh.createdReviewers.forEach(createdReviewer => {
                    expect(retrievedReviewers.body).toContainEqual({ _id: createdReviewer._id, name: createdReviewer.name, company: createdReviewer.company });
                });
            });
    });

    it('gets a reviewer by id', () => {
        return request(app)
            .get(`/reviewer/${rh.createdReviewers[0]._id}`)
            .then(({ body }) => expect(body).toEqual({ _id: rh.createdReviewers[0]._id, name: rh.createdReviewers[0].name, company: rh.createdReviewers[0].company }));
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
