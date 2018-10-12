/* eslint-disable  no-console */
const { parse } = require('url');
const mongoose = require('mongoose');

const log = (event, dbUrl) => {
    return () => {
        console.log(`${event.toUpperCase()}: connection to ${dbUrl}`);
    };
};

const redactURLAuth = url => {
    const parsedUrl = parse(url);
    const redactedAuth = parsedUrl.auth ? '***:***@' : '';

    return `${parsedUrl.protocol}//${redactedAuth}${parsedUrl.hostname}:${parsedUrl.port}${parsedUrl.path}`;
};

module.exports = (dbUrl = process.env.MONGODB_URI) => {
    mongoose.connect(dbUrl, { useNewUrlParser: true });

    const redactedUrl = redactURLAuth(dbUrl);

    mongoose.connection.on('error', log('error', redactedUrl));

    mongoose.connection.on('open', log('open', redactedUrl));

    mongoose.connection.on('close', log('close', redactedUrl));

    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });
};
