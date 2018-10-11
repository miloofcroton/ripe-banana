const Studio = require('../../lib/models/Studio');
const Chance = require('chance');
const chance = new Chance();

describe('studio model', () => {

    it('validates a good model', () => {

        const data = {
            name: chance.name(),
            address: {
                city: chance.city(),
                state: chance.state(),
                country: chance.country({ full: true })
            }
        };

        const studio = new Studio(data);
        const jsonStudio = studio.toJSON();
        expect(jsonStudio).toEqual({ ...data, _id: expect.any(Object) });
    });





});
