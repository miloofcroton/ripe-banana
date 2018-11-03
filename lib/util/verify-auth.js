const Reviewer = require('../models/Reviewer');
const { HttpError } = require('./errors');

module.exports = (req, res, next) => {
    // ensure that a token is passed
    // ensure that the token contains a user
    // Bearer OUR_TOKEN_HERE
    const token = req.token;
    if(!token) {
        next(new HttpError({
            code: 401,
            message: 'Missing token'
        }));
        return;
    }

    Reviewer.findByToken(token).then(user => {
        if(user) {
            req.user = user;
            next();
        } else {
            next(new HttpError({
                code: 401,
                message: 'Invalid token'
            }));
        }
    });
};
