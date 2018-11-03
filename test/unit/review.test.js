const { getErrors } = require('../util/helpers');
const Review = require('../../lib/models/Review');
const Reviewer = require('../../lib/models/Reviewer');
const Film = require('../../lib/models/Film');
const Actor = require('../../lib/models/Actor');
const Studio = require('../../lib/models/Studio');
const Chance = require('chance');
const chance = new Chance();
// const bcrypt = require('bcrypt');

describe('Review model', () => {


    const studio = new Studio(
        {
            name: chance.name(),
            address: {
                city: chance.city(),
                state: chance.state(),
                country: chance.country({ full: true })
            }
        });
    
    const actor = new Actor(
        {
            name: chance.name(),
            dob: chance.birthday(),
            pob: chance.city()
        });

    const reviewer = new Reviewer({
        name: chance.name(),
        company: chance.company()
    }); 

    const film = new Film({
        title: chance.word(),
        studio: studio._id,
        released: chance.natural({ min: 1900, max: 2050 }),
        cast: [{
            role: chance.name(),
            actor: actor._id
        }]
    });

    it('validates a good model', () => {

        const data = {
            rating: chance.natural({ min:1, max: 5 }),
            reviewer: reviewer._id, 
            review: chance.string({ length: 50 }),
            film: film._id 
        };

        const review = new Review(data);
        const jsonReview = review.toJSON();
        expect(jsonReview).toEqual({ 
            ...data, 
            _id: expect.any(Object),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
        });
    });

    it('requires a rating, reviewer, review, and film', () => {
        const data = {};
 
        const review = new Review(data);
        const errors = getErrors(review.validateSync(), 4);
        expect(errors.rating.properties.message).toEqual('Path `rating` is required.');
        expect(errors.reviewer.properties.message).toEqual('Path `reviewer` is required.');
        expect(errors.review.properties.message).toEqual('Path `review` is required.');
        expect(errors.film.properties.message).toEqual('Path `film` is required.');


    });
    it('requires a rating between 1 and 5', () => {
        const data = {
            rating: chance.natural({ min: 6 }),
            reviewer: reviewer._id,
            review: chance.string({ length: 50 }),
            film: film._id
        };

        const review = new Review(data);
        const errors = getErrors(review.validateSync(), 1);
        expect(errors.rating.properties.message).toEqual(`Path \`rating\` (${data.rating}) is more than maximum allowed value (5).`);
    });

    it('requires reviewer and film already in database', () => {

        const fakeReviewer = 'I am not even a schema instance';
        const fakeFilm = 'I am not even a schema instance';


        const data = {
            rating: chance.natural({ min: 1, max: 5 }),
            reviewer: fakeReviewer._id,
            review: chance.string({ length: 50 }),
            film: fakeFilm._id        };

        const review = new Review(data);
        const errors = getErrors(review.validateSync(), 2);
        expect(errors.reviewer.properties.message).toEqual('Path `reviewer` is required.');
        expect(errors.film.properties.message).toEqual('Path `film` is required.');

    });
});
