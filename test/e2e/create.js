const app = require('../../lib/app');
const request = require('supertest');
const { dropCollection } = require('../util/db');
const { actorsData, studiosData, reviewersData, filmsData, reviewsData } = require('./mock-data');

let reviewers;
let reviewerTokens;
let actors;
let studios;
let films;
let reviews;

const createReviewer = reviewer => {
    return request(app)
        .post('/reviewers/signup')
        .send(reviewer)
        .then(res => res.body);
};

const createReviewerToken = reviewer => {
    return request(app)
        .post('/reviewers/signin')
        .send(reviewer)
        .then(res => res.body.token);
};

const createActor = actor => {
    return request(app)
        .post('/actors')
        .set('Authorization', `Bearer ${reviewerTokens[0]}`)
        .send(actor)
        .then(res => res.body);
};

const createStudio = studio => {
    return request(app)
        .post('/studios')
        .set('Authorization', `Bearer ${reviewerTokens[0]}`)
        .send(studio)
        .then(res => res.body);
};

const createFilm = film => {
    return request(app)
        .post('/films')
        .set('Authorization', `Bearer ${reviewerTokens[0]}`)
        .send(film)
        .then(res => res.body);
};

const createReview = review => {
    return request(app)
        .post('/reviews')
        .set('Authorization', `Bearer ${reviewerTokens[0]}`)
        .send(review)
        .then(res => res.body);
};

beforeEach(() => {
    return Promise.all([
        dropCollection('reviewers'),
        dropCollection('actors'),
        dropCollection('studios'),
        dropCollection('films'),
        dropCollection('reviews')
    ]);
});

beforeEach(() => {
    return Promise.all(reviewersData.map(createReviewer)).then(results => {
        reviewers = results;
    });
});

beforeEach(() => {
    return Promise.all(reviewersData.map(createReviewerToken)).then(results => {
        reviewerTokens = results;
    });
});

beforeEach(() => {
    return Promise.all(actorsData.map(createActor)).then(results => {
        actors = results;
    });
});

beforeEach(() => {
    return Promise.all(studiosData.map(createStudio)).then(results => {
        studios = results;
    });
});

beforeEach(() => {
    filmsData[0].studio = studios[0]._id;
    filmsData[0].cast[0].actor = actors[0]._id;
    filmsData[0].cast[1].actor = actors[1]._id;
    filmsData[1].studio = studios[0]._id;
    filmsData[1].cast[0].actor = actors[0]._id;
    filmsData[1].cast[1].actor = actors[1]._id;
    return Promise.all(filmsData.map(createFilm)).then(results => {
        films = results;
    });
});

beforeEach(() => {
    reviewsData[0].reviewer = reviewers[0]._id;
    reviewsData[0].film = films[0]._id;
    reviewsData[1].reviewer = reviewers[0]._id;
    reviewsData[1].film = films[1]._id;
    return Promise.all(reviewsData.map(createReview)).then(results => {
        reviews = results;
    });
});

const getReviewers = () => reviewers;
const getReviewerTokens = () => reviewerTokens;
const getActors = () => actors;
const getStudios = () => studios;
const getFilms = () => films;
const getReviews = () => reviews;

module.exports = {
    getReviewers,
    getReviewerTokens,
    getActors,
    getStudios,
    getFilms,
    getReviews
};
