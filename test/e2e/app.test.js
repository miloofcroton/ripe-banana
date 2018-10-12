const { dropCollection } = require('../util/db');
const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();

describe('end to end resource testing', () => {

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
        {
            name: chance.name(),
            address: {
                city: chance.city(),
                state: chance.state(),
                country: chance.country({ full: true })
            }
        }
    ];

    let createdStudios;

    const studioMaker = studio => {
        return request(app)
            .post('/studios')
            .send(studio)
            .then(res => res.body);
    };

    beforeEach(() => {
        return dropCollection('studios');
    });

    beforeEach(() => {
        return Promise.all(studios.map(studioMaker))
            .then(studioRes => createdStudios = studioRes);
    });

    it('this creates a studio', () => {
        const studio = {
            name: chance.name(),
            address: {
                city: chance.city(),
                state: chance.state(),
                country: chance.country({ full: true })
            }
        };
        return request(app)
            .post('/studios')
            .send(studio)
            .then(({ body }) => {
                expect(body).toEqual({
                    ...studio,  
                    _id: expect.any(String),
                    __v: expect.any(Number),
                });
            });
    });

    it('gets all studios', () => {

        return request(app)
            .get('/studios')
            .then(retrievedStudios => {
                createdStudios.forEach(createdStudio => {
                    expect(retrievedStudios.body).toContainEqual(createdStudio);
                });
            });



    });


});
