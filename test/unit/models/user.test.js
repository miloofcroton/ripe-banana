const { getErrors } = require('../../util/helpers');
const User = require('../../../lib/models/User');
const Chance = require('chance');
const chance = new Chance();

describe('User model', () => {

    it('validates a good model', () => {

        const data = {
            name: chance.name(),
            email: chance.email(),
            clearPassword: chance.string({ length: 10 })
        };

        const user = new User(data);
        const jsonUser = user.toJSON();
        expect(jsonUser).toEqual({ 
            _id: expect.any(Object),
            name: data.name,
            email: data.email,
            roles: []
        });
    });

    it('requires a name and email', () => {

        const user = new User({});

        const errors = getErrors(user.validateSync(), 2);
        expect(errors.name.properties.message).toEqual('Username is required');
        expect(errors.email.properties.message).toEqual('Email is required');
    });
});
