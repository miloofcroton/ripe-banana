const { dropCollection } = require('../util/db');
const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();


describe('end to end review testing', () => {

    let createdReviewers;
    let createdActors;
    let createdStudios;
    let createdFilms;
    let createdReviews;

    let reviews = [{
        rating: chance.natural({ min: 1, max: 5 }),
        review: chance.string({ length: 50 })
    }, {
        rating: chance.natural({ min: 1, max: 5 }),
        review: chance.string({ length: 50 })
    }];
    
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
            .then(reviewerRes => createdReviewers = reviewerRes)
            .then(() => createdReviewers.forEach((reviewer, index) => {
                reviews[index].reviewer = reviewer;
            }));
    });

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
            .then(filmRes => createdFilms = filmRes)
            .then(() => createdFilms.forEach((film, index) => {
                reviews[index].film = film;
            }));
    });

    const reviewWriter = review => {
        return request(app)
            .post('/reviews')
            .send(review)
            .then(res => res.body);
    };

    beforeEach(() => {
        return dropCollection('reviews');
    });

    beforeEach(() => {
        return Promise.all(reviews.map(reviewWriter))
            .then(reviewRes => createdReviews = reviewRes);
    });

    it('this creates a review', () => {
        const review = {
            rating: chance.natural({ min: 1, max: 5 }),
            review: chance.string({ length: 50 }),
            reviewer: createdReviewers[0]._id,
            film: createdFilms[0]._id
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



});


