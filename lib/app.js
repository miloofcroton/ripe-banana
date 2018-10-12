const express = require('express');
const app = express();
const morgan = require('morgan');
const { handler, HttpError } = require('./util/errors');


// Middleware
app.use(morgan('dev'));
app.use(express.json());


// Routes
const studios = require('./routes/studios');
app.use('/studios', studios);


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
