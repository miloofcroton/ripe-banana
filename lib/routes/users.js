const router = require('express').Router();
const User = require('../models/User');
const { HttpError } = require('../util/errors');
const ensureAuth = require('../util/ensure-auth');

module.exports = router
    .post('/signup', (req, res, next) => {
        const { name, email, clearPassword } = req.body;
        User.create({
            name,
            email,
            clearPassword
        }).then(user => {
            res.json(user);
        });
    })
    .post('/signin', (req, res, next) => {
        const { email, clearPassword } = req.body;
        User.findOne({ email }).then(user => {
            // user === null
            const correctPassword = user && user.compare(clearPassword);
            if(correctPassword) {
                // should send token back
                const token = user.authToken();
                res.json({ token });
            } else {
                next(new HttpError({
                    code: 401,
                    message: 'Bad email or password'
                }));
            }
        });
    })
    .get('/verify', ensureAuth, (req, res, next) => {
        res.json({ success: !!req.user });
    });
