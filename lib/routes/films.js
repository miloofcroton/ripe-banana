const router = require('express').Router();
const Film = require('../models/Film');
const Review = require('../models/Review');
const verifyAuth = require('../util/verify-auth');

module.exports = router
    .post('/', verifyAuth, (req, res, next) => {
        const { title, studio, released, cast, password  } = req.body;
        Film.create({ title, studio, released, cast, password })
            .then(film => res.json(film))
            .catch(next);
    })
    .get('/', (req, res, next) => {
        const { query } = req;
        Film.find(query)
            .select({ _id: true, title: true, released: true, studio: true })
            .populate({ path: 'studio', select: 'name' })
            .lean()
            .then(films => res.json(films))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        const { id } = req.params;
        Promise.all([
            (
                Film.findById(id)
                    .select({ _id: false, __v: false })
                    .populate({ path: 'studio', select: 'name' })
                    .populate({ path: 'cast.actor', select: 'name' })
                    .lean()
            ),
            (
                Review.find({ film: id })
                    .select({ _id: true, rating: true, review: true, reviewer: true })
                    .populate({ path: 'reviewer', select: 'name' })
                    .lean()
            )
        ])
            .then(([film, reviews]) => {
                film.reviews = reviews;
                res.json(film);
            })
            .catch(next);
    })
    .delete('/:id', verifyAuth, (req, res, next) => {
        const { id } = req.params;
        Film.deleteOne({ _id: id })
            .lean()
            .then(() => res.json({ removed: true }))
            .catch(next);

    });
