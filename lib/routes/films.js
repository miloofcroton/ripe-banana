const router = require('express').Router();
const Film = require('../models/Film');

const updateOptions = {
    new: true,
    runValidators: true
};

module.exports = router
    .post('/', (req, res, next) => {
        const { title, studio, released, cast  } = req.body;
        Film.create({ title, studio, released, cast })
            .then(film => res.json(film))
            .catch(next);
    })
    .get('/', (req, res, next) => {
        const { query } = req;
        Film.find()
            .select({ _id: true, title: true, released: true, studio: true })
            .lean()
            .then(films => res.json(films))
            .catch(next);
    });
