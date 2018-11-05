const Reviewer = require('../models/Reviewer');
const { HttpError } = require('./errors');

module.exports = (req, res, next) => {
    const token = req.token;
    if(!token) {
        next(new HttpError({
            code: 401,
            message: 'Sign-in required'
        }));
        return;
    }
    Reviewer.findByToken(token).then(user => {
        if(user) {
            if(user.roles.includes('admin')) {
                req.user = user;
                next();
            } else {
                next(new HttpError({
                    code: 403,
                    message: 'Only administrators allowed to make these changes'
                }));
            }
        } else {
            next(new HttpError({
                code: 401,
                message: 'Incorrect email or password'
            }));
        }
    });
}; 
