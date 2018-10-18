const { dropCollection } = require('../util/db');
const User = require('../../lib/models/User');
const app = require('../../lib/app');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const Chance = require('chance');
const chance = new Chance();

const { ResourceHelper } = require('../util/helpers');
const rh = new ResourceHelper;



const checkStatus = statusCode => res => {
    expect(res.status).toEqual(statusCode);
};

const withToken = user => {
    return request(app)
        .post('/users/signin')
        .send({ email: `${user.email}`, clearPassword: `${user.clearPassword}` })
        .then(({ body }) => body.token);
};

describe('user routes', () => {


    const createUser = user => {
        return User.create(user);
    };
    let token;

    beforeEach(() => {
        return (async() => {
            await dropCollection('users');
            await rh.init('users', 1);
            await Promise.all(rh.users.map(createUser))
                .then(cs => rh.createdUsers = cs);
            await withToken(rh.users[0])
                .then(createdToken => {
                    token = createdToken;
                });
        })();
    });

    it('hashes a users password', () => {
        return User.create({
            name: 'ryan',
            clearPassword: 'testing1234',
            email: 'ryan@test.com'
        }).then(user => {
            expect(user.clearPassword).not.toEqual('testing1234');
            expect(bcrypt.compareSync('testing1234', user.passwordHash));
        });
    });

    it('creates a user on signup', () => {
        return request(app)
            .post('/users/signup')
            .send({ name: 'ryan', email: 'ryan@ryan.com', clearPassword: 'testing1234' })
            .then(({ body: user }) => {
                // const user = res.body
                expect(user).toEqual({ _id: expect.any(String), name: 'ryan', email: 'ryan@ryan.com', roles: [] });
            });
    });

    it('compares passwords', () => {
        const validPassword = rh.users[0].clearPassword;
        const invalidPassword = `${validPassword}1234`;

        const validCompare = rh.createdUsers[0].compare(validPassword);
        const invalidCompare = rh.createdUsers[0].compare(invalidPassword);

        expect(validCompare).toBeTruthy();
        expect(invalidCompare).toBeFalsy();
    });

    it('signs in a user', () => {
        return request(app)
            .post('/users/signin')
            .send({ email: rh.createdUsers[0].email, clearPassword: rh.users[0].clearPassword })
            .then(res => {
                checkStatus(200)(res);

                expect(res.body.token).toEqual(expect.any(String));
            });
    });

    it('rejects signing in a bad user', () => {
        return request(app)
            .post('/users/signin')
            .send({ email: rh.createdUsers[0].email, clearPassword: `${ rh.users[0].clearPassword}1234` })
            .then(checkStatus(401));
    });

    it('rejects signing in a user with bad email', () => {
        return request(app)
            .post('/users/signin')
            .set('Authorization', `Bearer ${token}`)
            .send({ email: `${rh.createdUsers[0].email}`, clearPassword: `${ rh.users[0].clearPassword}1234` })
            .then(checkStatus(401));
    });

    it('verifies a signed in user', () => {
        return withToken(rh.users[0])
            .then(token => {
                return request(app)
                    .get('/users/verify')
                    .set('Authorization', `Bearer ${token}`)
                    .then(res => {
                        expect(res.body).toEqual({ success: true });
                    });
            });

    });

    // it('creates an auth token', () => {
    //     return rh.createdUsers[0].authToken()
    //         .then(token => {
    //             expect(token).toEqual(expect.any(String));
    //             return token;
    //         })
    //         .then(token => {
    //             return User.verifyToken(token).then(user => {
    //                 expect(user).toEqual({});
    //             });
    //         });
    // });
});
