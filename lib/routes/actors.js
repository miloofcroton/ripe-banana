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
    })  
    .get('/', (req, res, next) => {
        const { query } = req;
        Actor.find(query)
            .then(actors => res.json(actors))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        const { id } = req.params;
        Actor.findById(id)
            .then(actor => res.json(actor))
            .catch(next);
    })
    .put('/:id', (req, res, next) => {
        const { id } = req.params;
        const { name, dob, pob } = req.body;
        Actor.replaceOne({ _id: id }, { _id: id, name, dob, pob })
            // .then(() =>  res.json({ _id: id, name: actor.name });
            .then(() => res.json({ _id: id, name: name }))
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        const { id } = req.params;
        Actor.deleteOne({ _id: id })
            .then(() => res.json({ removed: true }))
            .catch(next);

    });
