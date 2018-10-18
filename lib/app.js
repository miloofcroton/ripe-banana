const express = require('express');
const app = express();

const morgan = require('morgan');
const checkMongo = require('./util/check-mongo');
const bearerToken = require('./util/bearer-token');
const ensureAuth = require('./util/ensure-auth');
const { handler, HttpError } = require('./util/errors');


// Middleware
app.use(checkMongo);
app.use(morgan('dev', {
    skip() {
        // skip logging on test
        return process.env.NODE_ENV === 'test';
    }
}));
app.use(express.json());
app.use(bearerToken);

// Auth
const user = require('./routes/users');
app.use('/users', user);
// app.use(ensureAuth);

// Routes
const studios = require('./routes/studios');
app.use('/studios', studios);
const actors = require('./routes/actors');
app.use('/actors', actors);
const reviewers = require('./routes/reviewers');
app.use('/reviewer', reviewers);
const films = require('./routes/films');
app.use('/films', films);
const reviews = require('./routes/reviews');
app.use('/reviews', reviews);

// Errors
app.get('/error', (req, res) => {
    throw new HttpError({ code: 505, message: 'my HttpError' });
});
app.use((req, res) => {
    console.log('This is 404');
    res.status(404);
    res.end('404 Not Found');
});
app.use(handler);

module.exports = app;
