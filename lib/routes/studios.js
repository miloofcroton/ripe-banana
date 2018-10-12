const router = require('express').Router();
const Studio = require('../models/Studio');

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
    });
