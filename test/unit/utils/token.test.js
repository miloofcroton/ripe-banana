const { tokenize, untokenize } = require('../../../lib/util/tokenizer');

describe('tokenizer', () => {
    it('creates a token for a payload', () => {
        const token = tokenize({ name: 'ryan' });
        expect(token).toEqual(expect.any(String));
    });

    it('decodes a token with payload', () => {
        const token = tokenize({ name: 'ryan' });
        const decodedToken = untokenize(token);

        expect(decodedToken).toEqual({ name: 'ryan' });
    });
});
