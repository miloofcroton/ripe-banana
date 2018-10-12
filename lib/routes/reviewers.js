const router = require('express').Router();
const Reviewer = require('../models/Reviewer');

const updateOptions = {
    new: true,
    runValidators: true
};

module.exports = router
    .post('/', (req, res, next) => {
        const { name, company } = req.body;
        Reviewer.create({ name, company })
            .then(reviewer => res.json(reviewer))
            .catch(next);
    })
    .get('/', (req, res, next) => {
        const { query } = req;
        Reviewer.find(query)
            .select({ _id: true, name: true, company: true })
            .lean()
            .then(reviewers => res.json(reviewers))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        const { id } = req.params;
        Reviewer.findById(id)
            .select({ _id: true, name: true, company: true })
            .lean()
            .then(reviewer=> res.json(reviewer))
            .catch(next);
    })
    .put('/:id', (req, res, next) => {
        const { id } = req.params;
        const { name, company } = req.body;
        Reviewer.replaceOne({ _id: id }, { _id: id, name, company })
            .lean()
            .then(confirm => {
                if(confirm.ok) res.json({ _id: id, name: name, company: company });
            })
            .catch(next);
    });
    
