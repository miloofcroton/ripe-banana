const router = require('express').Router();
const Film = require('../models/Film');

const updateOptions = {
    new: true,
    runValidators: true
};

module.exports = router
    .post('/', (req, res, next) => {
        const { title, studio, released, cast  } = req.body;
        console.log(req.body);
        Film.create({ title, studio, released, cast })
            .then(film => res.json(film))
            .catch(next);
    }); 
