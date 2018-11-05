const request = require('supertest');
const app = require('../../lib/app');
const Chance = require('chance');
const chance = new Chance();
const { ResourceHelper } = require('../util/helpers');
const { dropCollection } = require('../util/db');
const { getReviewerTokens, getActors,  getFilms } = require('./create');


describe('end to end actor testing', () => {

    const rh = new ResourceHelper;

    // beforeEach(() => rh.wrapper('actors', 3));

    beforeEach(() => {
        return (async() => {
            await dropCollection('films');
            await rh.init('films', 104);

            await rh.wrapper('actors', 2);
            await rh.assign('films', 'createdActors', 'cast[0].actor');

            await rh.wrapper('studios', 2);
            await rh.assign('films', 'createdStudios', 'studio');

            await rh.taskRunner('films');
        })();
    });


    it('gets all actors', () => {

        return request(app)
            .get('/actors')
            .then(({ body }) => {
                rh.createdActors.forEach(createdActor => {
                    expect(body).toContainEqual({ _id: createdActor._id, name: createdActor.name });
                });
            });
    });

    it('gets an actor by id', () => {
        return request(app)
            .get(`/actors/${rh.createdActors[0]._id}`)
            .then(({ body }) => expect(body).toEqual({
                name: rh.createdActors[0].name,
                dob: rh.createdActors[0].dob,
                pob: rh.createdActors[0].pob,
                films: expect.any(Object)
            }));
    });

    it('this creates an actor if user is an admin', () => {
        
        const reviewerTokens = getReviewerTokens();

        const actor = {
            name: chance.name(),
            dob: chance.birthday(),
            pob: chance.city()
        };
        return request(app)
            .post('/actors')
            .set('Authorization', `Bearer ${reviewerTokens[0]}`)
            .send(actor)
            .then(({ body }) => {
                expect(body).toEqual({
                    ...actor,
                    dob: actor.dob.toISOString(),
                    _id: expect.any(String),
                    __v: expect.any(Number)
                });
            });
    });

    it('this will not create an actor if user is not an admin', () => {
        
        const reviewerTokens = getReviewerTokens();

        const actor = {
            name: chance.name(),
            dob: chance.birthday(),
            pob: chance.city()
        };
        return request(app)
            .post('/actors')
            .set('Authorization', `Bearer ${reviewerTokens[0]}`)
            .send(actor)
            .then(result => {
                expect(result.body).toEqual({});
            });
    });

    it('updates an actor', () => {

        const newActor = {
            name: chance.name(),
            dob: chance.birthday(),
            pob: chance.city()
        };

        return request(app)
            .put(`/actors/${rh.createdActors[0]._id}`)
            .send(newActor)
            .then(({ body }) => expect(body).toEqual({ _id: expect.any(String), name: newActor.name }));
    });

    it('deletes an actor', () => {

        const reviewerTokens = getReviewerTokens();

        let actor = {
            name: chance.name(),
            dob: chance.birthday(),
            pob: chance.city()
        };

        return (async() => {

            await request(app)
                .post('/actors')
                .send(actor)
                .then(({ body }) => actor.id = body._id);
            await request(app)
                .delete(`/actors/${actor.id}`)
                .set('Authorization', `Bearer ${reviewerTokens[0]}`)
                .then(({ body }) => expect(body).toEqual({ removed: true }));
        })();
    });

    it('does not delete an actor if they are in films', () => {
        
        const reviewerTokens = getReviewerTokens();
        
        return request(app)
            .delete(`/actors/${rh.createdActors[0]._id}`)
            .set('Authorization', `Bearer ${reviewerTokens[0]}`)
            .then(({ body }) => expect(body).toEqual({ removed: false }));
    });


});
