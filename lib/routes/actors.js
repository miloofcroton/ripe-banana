const router = require('express').Router();
const Actor = require('../models/Actor');

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
            .select({ _id: true, name: true })
            .lean()
            .then(actors => res.json(actors))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        const { id } = req.params;
        Actor.findById(id)
            .lean()
            .then(actor => res.json(actor))
            .catch(next);
    })
    .put('/:id', (req, res, next) => {
        const { id } = req.params;
        const { name, dob, pob } = req.body;
        Actor.replaceOne({ _id: id }, { _id: id, name, dob, pob })
            .lean()
            .then(confirm => {
                if(confirm.ok) res.json({ _id: id, name: name });
            })
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        const { id } = req.params;
        Actor.deleteOne({ _id: id })
            .lean()
            .then(() => res.json({ removed: true }))
            .catch(next);

    });
