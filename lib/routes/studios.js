const router = require('express').Router();
const Studio = require('../models/Studio');
const Film = require('../models/Film');

module.exports = router
    .post('/', (req, res, next) => {
        const { name, address } = req.body;
        Studio.create({ name, address })
            .then(studio => res.json({ _id: studio._id, name: studio.name, address: studio.address }))
            .catch(next);
    })
    .get('/', (req, res, next) => {
        const { query } = req;
        Studio.find(query)
            .select({ __v: false, address: false })
            .lean()
            .then(studios => res.json(studios))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        const { id } = req.params;
        Promise.all([
            (
                Studio.findById(id)
                    .select({ __v: false })
                    .lean()
            ),
            (
                Film.find({ studio: id })
                    .select({ _id: true, title: true })
                    .lean()
            )
        ])
            .then(([studio, films]) => {
                studio.films = films;
                res.json(studio);
            })
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        const { id } = req.params;
        Film.countDocuments({ studio: id })
            .lean()
            .then(results => {
                if(results) res.json({ removed: false });
                else Studio.deleteOne({ _id: id })
                    .lean()
                    .then(() => res.json({ removed: true }));
            })
            .catch(next);
    });


