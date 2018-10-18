const bearerToken = require('../../../lib/util/bearer-token.js');

describe('bearer token middleware', () => {
    it('adds a bearer token to request', () => {
        const token = 'abcd';
        const req = {
            get: () => {
                return `Bearer ${token}`;
            }
        };

        let called = false;
        const next = () => {
            called = true;
        };

        bearerToken(req, null, next);

        expect(called).toBeTruthy();
        expect(req.token).toEqual(token);
    });

    it('does not add a token when no authorization header provided', () => {
        const req = {
            get: () => {
                return null;
            }
        };

        let called = false;
        const next = () => {
            called = true;
        };

        bearerToken(req, null, next);

        expect(called).toBeTruthy();
        expect(req.token).toBeUndefined();
    });
});
