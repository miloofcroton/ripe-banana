const express = require('express');
const app = express();
const morgan = require('morgan');
const { handler, HttpError } = require('./util/errors');
const bearerToken = require('./util/bearer-token');

// Middleware
// app.use(morgan('dev'));
app.use(express.json());

app.use(express.static('public'));
app.use(bearerToken);

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
    // console.log('This is 404');
    res.status(404);
    res.end('404 Not Found');
});
app.use(handler);

module.exports = app;
