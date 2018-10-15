const Chance = require('chance');
const chance = new Chance();

const getErrors = (validation, numberExpected) => {
    expect(validation).toBeDefined();
    const errors = validation.errors;
    expect(Object.keys(errors)).toHaveLength(numberExpected);
    return errors;
};

class StudioHelper {
    constructor(){ 
        this.studios = [];
    }
    template() {
        return {
            name: chance.name(),
            address: {
                city: chance.city(),
                state: chance.state(),
                country: chance.country({ full: true })
            }
        };
    } 
    task(studio) {
        return request(app)
            .post('/studios')
            .send(studio)
            .then(res => res.body);
    }
    taskRunner() {
        return Promise.all(studios.map(studioMaker))
            .then(studioRes => createdStudios = studioRes);
    }
}

class reviewersHelper {
    constructor(){ 
        this.reviewers = [];
    }

    
}


const reviewersTemplate = 
{
    name: chance.name(),
    company: chance.company()
};

const actorsTemplate =
{
    name: chance.name(),
    dob: chance.birthday(),
    pob: chance.city()
};

const filmsTemplate = 
{
    title: chance.word(),
    released: chance.natural({ min: 1900, max: 2050 }),
    cast: [{
        role: chance.name(),
    }]
};

const reviewsTemplate = 
{
    rating: chance.natural({ min: 1, max: 5 }),
    review: chance.string({ length: 50 })
};





//add helper functions to refactor e2e tests

module.exports = {
    getErrors,
    StudioHelper
};

