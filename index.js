require('dotenv').config();
require('../lib/mongoose-connector');
const { createServer } = require('http');
const app = require('./lib/app');

const port = 7890;

const server = createServer(app);

server.listen(port, () => {
    /* eslint-disable-next-line no-console */
    console.log(`Listening on ${port}`);
});
