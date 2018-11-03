const router = require('express').Router();
const Reviewer = require('../models/Reviewer');
const Review = require('../models/Review');
const verifyAuth = require('../util/verify-auth');


module.exports = router
    .post('/', verifyAuth, (req, res, next) => {
        const { name, company } = req.body;
        Reviewer.create({ name, company })
            .then(reviewer => res.json(reviewer))
            .catch(next);
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
    .put('/:id', verifyAuth, (req, res, next) => {
        const { id } = req.params;
        const { name, company } = req.body;
        Reviewer.replaceOne({ _id: id }, { _id: id, name, company })
            .lean()
            .then(confirm => {
                if(confirm.ok) res.json({ _id: id, name: name, company: company });
            })
            .catch(next);
    });
    
