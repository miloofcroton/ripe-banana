const { getErrors } = require('../util/helpers');
const Actor = require('../../lib/models/Actor');
const Chance = require('chance');
const chance = new Chance();
// const bcrypt = require('bcrypt');

describe('Actor model', () => {

    it('validates a good model', () => {

        const data = {
            name: chance.name(),
            dob: chance.birthday(),
            pob: chance.city()
        };

        const actor = new Actor(data);
        const jsonActor = actor.toJSON();
        expect(jsonActor).toEqual({ ...data, _id: expect.any(Object) });
    });

    it('requires a name', () => {

        const actor = new Actor({
            dob: chance.birthday(),
            pob: chance.city()
        });

        const errors = getErrors(actor.validateSync(), 1);
        expect(errors.name.properties.message).toEqual('Path `name` is required.');
    });





});
