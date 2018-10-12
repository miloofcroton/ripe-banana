const router = require('express').Router();
const Studio = require('../models/Studio');

const updateOptions = {
    new: true,
    runValidators: true
};

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
            .then(studios => res.json(studios))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        const { id } = req.params;
        Studio.findById(id)
            .then(studios => res.json(studios))
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        const { id } = req.params;
        Studio.deleteOne({ _id: id })
            .then(() => res.json({ removed: true }))
            .catch(next);

    });
