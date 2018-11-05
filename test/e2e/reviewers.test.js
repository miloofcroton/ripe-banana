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
            email: chance.email(),
            role: 'admin',
            password: chance.string()
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
                    expect(retrievedReviewers.body).toContainEqual({ _id: createdReviewer._id, name: createdReviewer.name, company: createdReviewer.company, email: createdReviewer.email, role: createdReviewer.role, password: createdReviewer.password });
                });
            });
    });

    it('hashes a reviewers password', () => {
        return Reviewer.create({
            name: chance.name(),
            company: chance.company(),
            password: 'animals123'
        }).then(user => {
            expect(user.password).not.toEqual('animals123');
            expect(bcrypt.compareSync('animals123', user.passwordHash));
        });
    });

    it('compares passwords', () => {
        const reviewer = {
            name: 'Douglas Fir',
            company: 'Alta',
            password: 'animals123'
        };
        
        Reviewer.create(reviewer)
            .then(createdReviewer => {
                expect(createdReviewer.compare(reviewer.password)).toBeTruthy();
                expect(createdReviewer.compare('543lkj')).toBeFalsy();
            });
    });

    it('signs in a reviwer', () => {
        return request(app)
            .post('/api/reviewers/signin')
            .send({ email: 'douglefir@gmail.com', password: 'animals123' })
            .then(res => {
                checkOk(res);
                expect(res.body.token).toEqual(expect.any(String));
            });
    });

    it('rejects a sign in with a bad password', () => {
        return request(app)
            .post('/api/reviewers/signin')
            .send({ email: 'douglefir@gmail.com', password: 'badpassword' })
            .then(checkStatus(401));
    });

    it('rejects a sign in with a token but bad password', () => {
        let token;
        return request(app)
            .post('/api/reviewers/signin')
            .send({ email: 'wtree@gmail.com', password: 'wtree123' })
            .then(res => {
                token = res;
            })
            .then(request(app)
                .post('/api/reviewers/signin')
                .set('Authorization', `Bearer ${token}`)
                .send({ email: 'dfir@gmail.com', password: 'dfir12345' })
                .then(checkStatus(401)));
    });

    it('verifies a signed in user', () => {
        return request(app)
            .post('/api/reviewers/signin')
            .send({ email: 'dfir@gmail.com', password: 'dfir123' })
            .then(res => {
                return request(app)
                    .get('/api/reviewers/verify')
                    .set('Authorization', `Bearer ${res.body.token}`)
                    .then(res => {
                        expect(res.body).toEqual({ success: true });
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
            company: chance.company(),
            password: 'animals123'
        };

        return request(app)
            .put(`/reviewer/${rh.createdReviewers[0]._id}`)
            .send(newReviewer)
            .then(({ body }) => expect(body).toEqual({ _id: expect.any(String), name: newReviewer.name, company: newReviewer.company, password: newReviewer.password }));
    }); 
});
