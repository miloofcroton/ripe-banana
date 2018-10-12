const router = require('express').Router();
const Actor = require('../models/Actor');

const updateOptions = {
    new: true,
    runValidators: true
};

module.exports = router
    .post('/', (req, res, next) => {
        const { name, dob, pob  } = req.body;
        Actor.create({ name, dob, pob })
            .then(actor => res.json(actor))
            .catch(next);
    });    
