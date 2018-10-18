const router = require('express').Router();
const Actor = require('../models/Actor');
const Film = require('../models/Film');
const mongoose = require('mongoose');


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
    .get('/:id/agg', (req, res, next) => {
        const { id } = req.params;
        Actor.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(id) }
            },
            {
                $project: { '__v': false, '_id': false }
            }
        ])
            // .lean()
            .then(actor => res.json(actor))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        const { id } = req.params;
        Promise.all([
            (
                Actor.findById(id)
                    .select({ '__v': false, '_id': false })
                    .lean()
            ),
            (
                Film.find({ 'cast.actor': id }, 'title released')
                    .lean()
            )
        ])
            .then(([actor, films]) => {
                actor.films = films;
                res.json(actor);
            })
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
        Film.countDocuments({ 'cast.actor': id })
            .lean()
            .then(results => {
                if(results) res.json({ removed: false });
                else Actor.deleteOne({ _id: id })
                    .lean()
                    .then(() => res.json({ removed: true }));
            })
            .catch(next);
    });
