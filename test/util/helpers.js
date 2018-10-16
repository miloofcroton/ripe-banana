const Chance = require('chance');
const chance = new Chance();
const request = require('supertest');
const app = require('../../lib/app');

const getErrors = (validation, numberExpected) => {
    expect(validation).toBeDefined();
    const errors = validation.errors;
    expect(Object.keys(errors)).toHaveLength(numberExpected);
    return errors;
};

class ResourceHelper {
    constructor(){ 
        this.studios = [];
        this.createdStudios = [];
        this.actors = [];
        this.createdActors = [];
        this.films = [];
        this.createdFilms = [];
        this.reviews = [];
        this.createdReviews = [];
        this.reviewers = [];
        this.createdReviewers = [];
    }
    init(resource, length) {
        this[resource] = Array.apply(null, { length: length }).map(() => this.template(`${resource}`));
    }

    template(resource) {

        const templates = {
            studios: {
                name: chance.name(),
                address: {
                    city: chance.city(),
                    state: chance.state(),
                    country: chance.country({ full: true })
                },
            },
            reviews: {
                rating: chance.natural({ min: 1, max: 5 }),
                review: chance.string({ length: 50 })
            },
            reviewers: {
                name: chance.name(),
                company: chance.company()
            },
            films: {
                title: chance.word(),
                released: chance.natural({ min: 1900, max: 2050 }),
                cast: [{
                    role: chance.name(),
                }]
            },
            actors: {
                name: chance.name(),
                dob: chance.birthday(),
                pob: chance.city()
            }
        };
        return templates[resource];
    } 
    task(resource, data) {
        const routes = {
            studio: '/studios',
            actor: '/actors',
            reviewer: '/reviewer',
            review: '/reviews',
            film: '/films'
        };
        const route = routes[resource];
        return request(app)
            .post(route)
            .send(data)
            .then(res => res.body);
    }
    taskRunner(resource) {
        return Promise.all(this[resource + 's'].map(item => this.task(resource, item)))
            .then(response => this['created' + resource.slice(0, 1).toUpperCase() + resource.slice(1) + 's'] = response);
    }

}

module.exports = {
    getErrors,
    ResourceHelper
};

