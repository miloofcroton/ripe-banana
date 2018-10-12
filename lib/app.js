const express = require('express');
const app = express();
const morgan = require('morgan');
const { handler, HttpError } = require('./util/errors');

app.use(morgan('dev'));
app.use(express.json());

const studios = require('./routes/studios');

app.use('/studios', studios);

app.get('/error', (req, res) => {
    throw new HttpError({ code: 505, message: 'my HttpError' });
});

app.use((req, res) => {
    console.log('This is 404');
    res.status(404);
    res.end('404 Not Found');
});

// Error Handler middleware is last!
app.use(handler);

module.exports = app;
