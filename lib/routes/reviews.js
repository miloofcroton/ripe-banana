const router = require('express').Router();
const Review = require('../models/Review');

module.exports = router
    .post('/', (req, res, next) => {
        const { rating, review, reviewer, film } = req.body;
        Review.create({ rating, review, reviewer, film })
            .then(review => res.json(review))
            .catch(next);
    })
    .get('/', (req, res, next) => {
        const { query } = req;
        Review.find(query)
            .limit(100)
            .sort('createdAt')
            .select({ _id: true, rating: true, review: true, film: true })
            .populate({ path: 'film', select: 'title' })
            .lean()
            .then(reviewers => res.json(reviewers))
            .catch(next);
    });