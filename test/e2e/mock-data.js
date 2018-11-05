const Chance = require('chance');
const chance = new Chance();

const reviewersData = [
    { 
        name: chance.name(), 
        company: chance.company(),
        email: chance.email(),
        clearPassword: chance.string(),
        roles: ['admin'] 
    },
    { 
        name: chance.name(), 
        company: chance.company(),
        email: chance.email(),
        clearPassword: chance.string(),
        roles: ['editor']
    }
];

const actorsData = [
    {
        name: chance.name(),
        dob: new Date('1-1-1950'),
        pob: 'USA'
    },
    {
        name: chance.name(),
        dob: new Date('5-21-1990'),
        pob: 'Cambodia'
    },
    {
        name: chance.name(),
        dob: new Date('9-9-2000'),
        pob: 'Iraq'
    }
];

const studiosData = [
    {
        name: 'Chhing Studios',
        address: {
            city: 'Hillsboro',
            state: 'OR',
            country: 'USA'
        }
    },
    {
        name: 'Lioness',
        address: {
            city: 'Portland',
            state: 'OR',
            country: 'USA'
        }
    },
    {
        name: 'Tiny laugh Studio',
        address: {
            city: 'Gresham',
            state: 'OR',
            country: 'USA'
        }
    }
];

const filmsData = [
    {
        title: 'The Terminator',
        // studio:
        released: 1984,
        cast: [
            { role: 'Terminator robot' }, // actor:
            { role: 'Main Character' } // actor:
        ]
    },
    {
        title: 'Apple jacks',
        // studio: 
        released: 1988,
        cast: [
            { role: 'Hugo' }, // actor:
            { role: 'Caprice' } // actor:
        ]
    }
];

const reviewsData = [
    {
        rating: 4,
        // reviewer: 
        text: 'Amazingness!',
        // film:
    },
    {
        rating: 1,
        // reviewer: 
        text: 'I want the last 1.5 hours of my life back.',
        // film: 
    }
];

module.exports = {
    actorsData,
    studiosData,
    reviewersData,
    filmsData,
    reviewsData
};
