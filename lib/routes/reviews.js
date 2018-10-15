const router = require('express').Router();
const Review = require('../models/Review');

const updateOptions = {
    new: true,
    runValidators: true
};

module.exports = router
    .post('/', (req, res, next) => {
        const { rating, review, reviewer, film } = req.body;
        Review.create({ rating, review, reviewer, film })
            .then(review => res.json(review))
            .catch(next);
    })
    .get('/', (req, res, next) => {
        const { query } = req;
        Reviewer.find(query)
            .select({ _id: true, name: true, company: true })
            .lean()
            .then(reviewers => res.json(reviewers))
            .catch(next);
    });
