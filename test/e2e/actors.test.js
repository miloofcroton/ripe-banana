const { dropCollection } = require('../util/db');
const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();

describe('end to end actor testing', () => {

    it('this creates an actor', () => {
        const actor = {
            name: chance.name(),
            dob: chance.birthday(),
            pob: chance.city()
        };
        return request(app)
            .post('/actors')
            .send(actor)
            .then(({ body }) => {
                expect(body).toEqual({
                    ...actor,  
                    dob: expect.any(String),
                    _id: expect.any(String),
                    __v: expect.any(Number)
                });
            });
    });

});
