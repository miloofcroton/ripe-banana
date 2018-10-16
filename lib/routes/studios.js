const router = require('express').Router();
const Studio = require('../models/Studio');
const Film = require('../models/Film');

module.exports = router
    .post('/', (req, res, next) => {
        const { name, address } = req.body;
        Studio.create({ name, address })
            .then(studio => res.json(studio))
            .catch(next);
    })
    .get('/', (req, res, next) => {
        const { query } = req;
        Studio.find(query)
            .select({ _id: true, name: true })
            .lean()
            .then(studios => res.json(studios))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        const { id } = req.params;
        Studio.findById(id)
            .lean()
            .then(studios => res.json(studios))
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        const { id } = req.params;
        let films;
        Film.find()
            .where('studio')
            .equals(id)
            .lean()
            .then(film => {
                if(film) films = true;
            })
            .catch(next); 
        if(films) res.json({ removed: false });
        Studio.deleteOne({ _id: id })
            .lean()
            .then(() => res.json({ removed: true }))
            .catch(next);
    });
