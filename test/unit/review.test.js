const { getErrors } = require('../util/helpers');
const Review = require('../../lib/models/Review');
const Reviewer = require('../../lib/models/Reviewer');
const Film = require('../../lib/models/Film');
const Chance = require('chance');
const chance = new Chance();

describe('Review model', () => {

    it('validates a good model', () => {

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
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        });
    });

});
