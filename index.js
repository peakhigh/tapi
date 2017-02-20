const Promise = require('bluebird');
const mongoose = require('mongoose');
const config = require('./config/env');
let app = require('./config/express');
const expressJwt = require('express-jwt');

// promisify mongoose
Promise.promisifyAll(mongoose);

// connect to mongo db
mongoose.connect(config.db, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', (err) => {
  console.log('DB Error', err); 
  throw new Error(`unable to connect to database: ${config.db}`);
});

const debug = require('debug')('express-mongoose-es6-rest-api:index');

// TODO - set auth globally
// app.use(expressJwt({ secret: config.jwtSecret}).unless({path: ['/auth']}));

// listen on port config.port
app.listen(config.port, () => {
  debug(`server started on port ${config.port} (${config.env})`);
});

module.exports = app;
