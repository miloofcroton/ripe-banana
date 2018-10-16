const Chance = require('chance');
const chance = new Chance();
const request = require('supertest');
const { dropCollection } = require('../util/db');
const app = require('../../lib/app');

const getErrors = (validation, numberExpected) => {
    expect(validation).toBeDefined();
    const errors = validation.errors;
    expect(Object.keys(errors)).toHaveLength(numberExpected);
    return errors;
};

class ResourceHelper {
    constructor(){ 
        this.studios, this.createdStudios,
        this.actors, this.createdActors,
        this.films, this.createdFilms,
        this.reviews, this.createdReviews,
        this.reviewers, this.createdReviewers = [];
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
            studios: '/studios',
            actors: '/actors',
            reviewers: '/reviewer',
            reviews: '/reviews',
            films: '/films'
        };
        const route = routes[resource];
        return request(app)
            .post(route)
            .send(data)
            .then(res => res.body);
    }
    taskRunner(resource) {
        return Promise.all(this[resource].map(item => this.task(resource, item)))
            .then(response => this['created' + resource.replace(/^\w/, c => c.toUpperCase())] = response);
    }

    async wrapper(resource, number) {
        await this.init(resource, number);
        await dropCollection(resource);
        await this.taskRunner(resource);
    }

    assign(collection, source, link) {
        if(link === 'cast[0].actor') this.films.forEach((film, index) => { 
            film.cast[0].actor = this.createdActors[index % 2]._id;
        });
        else this[collection].forEach((item, index) => {
            item[link] = this[source][index % 2]._id;
        });
    }
}

module.exports = {
    getErrors,
    ResourceHelper
};

