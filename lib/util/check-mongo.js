const mongoose = require('mongoose');
const state = require('mongoose/lib/connectionstate');
const { HttpError } = require('./errors');

module.exports = (req, res, next) => {
    const currentState = mongoose.connection.readyState;
    if(currentState === state.connected || currentState === state.connecting) {
        next();
        return;
    }

    next(new HttpError({
        code: 500,
        message: 'Not connected to mongodb'
    }));
};
