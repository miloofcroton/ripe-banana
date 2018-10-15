const router = require('express').Router();
const Film = require('../models/Film');

module.exports = router
    .post('/', (req, res, next) => {
        const { title, studio, released, cast } = req.body;
        Film.create({ title, studio, released, cast })
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
        Film.findById(id)
            .select({ title: true, released: true, studio: true, cast: true })
            .populate({ path: 'studio', select: 'name' })
            .populate({ path: 'cast.actor', select: 'name' })
            .lean()
            .then(actor => res.json(actor))
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        const { id } = req.params;
        Film.deleteOne({ _id: id })
            .lean()
            .then(() => res.json({ removed: true }))
            .catch(next);

    });
