const { hash, compare } = require('../../../lib/util/hashing');

describe('password hasher', () => {
    it('hash a password', () => {
        const hashedPassword = hash('abcd');
        console.log(hashedPassword);
        expect(hashedPassword).not.toEqual('abcd');
    });

    it('compare a password', () => {
        const hashedPassword = hash('abcd');
        const comparePassword = compare('abcd', hashedPassword);
        expect(comparePassword).toBeTruthy();
    });

    it('compare a bad password', () => {
        const hashedPassword = hash('abcd');
        const comparePassword = compare('abc', hashedPassword);
        expect(comparePassword).toBeFalsy();
    });
});
