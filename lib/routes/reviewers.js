const router = require('express').Router();
const Reviewer = require('../models/Reviewer');
const Review = require('../models/Review');
const verifyAuth = require('../util/verify-auth');
const ensureAdmin = require('../util/ensure-admin');
const { HttpError } = require('../util/errors');

module.exports = router

    .post('/', (req, res, next) => {
        const { name, company, email, role } = req.body;
        Reviewer.create({ name, company, email, role })
            .then(reviewer => res.json(reviewer))
            .catch(next);
    })
    .post('/signup', verifyAuth, (req, res, next) => {
        const { name, company, email, role, clearPassword } = req.body;
        Reviewer.create({ name, company, email, role, clearPassword })
            .then(reviewer => res.json(reviewer))
            .catch(next);
    })

    .post('/signin', (req, res, next) => {
        const { email, clearPassword } = req.body;
        Reviewer.findOne({ email }).then(reviewer => {
            const correctPassword = reviewer && reviewer.compare(clearPassword);
            if(correctPassword) {
                const token = reviewer.authToken();
                res.json({ token });
            }
            else {
                next(new HttpError({
                    code: 401,
                    message: 'Bad email or password'
                }));
            }
        });
    })

    .get('/verify', verifyAuth, (req, res) => {
        res.json({ success: !!req.user });
    })

    .delete('/:id', (req, res) => {
        const { id } = req.params;
        Reviewer.findByIdAndDelete(id).then(user => res.json({ removed: !!user }));
    })

    .get('/', (req, res, next) => {
        const { query } = req;
        Reviewer.find(query)
            .select({ _id: true, name: true, company: true })
            .lean()
            .then(reviewers => res.json(reviewers))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const { id } = req.params;
        Promise.all([
            (
                Reviewer.findById(id)
                    .select({ _id: true, name: true, company: true })
                    .lean()
            ),
            (
                Review.find({ reviewer: req.params.id }, 'rating review film')
                    .lean()
                    .populate('film', 'title')
            )
        ])
            .then(([reviewer, reviews]) => {
                reviewer.reviews = reviews;
                res.json(reviewer);
            })
            .catch(next);
    })
    .put('/:id', ensureAdmin, (req, res, next) => {
        const { id } = req.params;
        const { name, company } = req.body;
        Reviewer.replaceOne({ _id: id }, { _id: id, name, company })
            .lean()
            .then(confirm => {
                if(confirm.ok) res.json({ _id: id, name: name, company: company });
            })
            .catch(next);
    });
    
