'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _env = require('./config/env');

var _env2 = _interopRequireDefault(_env);

var _express = require('./config/express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// promisify mongoose
_bluebird2.default.promisifyAll(_mongoose2.default);

// connect to mongo db
_mongoose2.default.connect(_env2.default.db, { server: { socketOptions: { keepAlive: 1 } } });
_mongoose2.default.connection.on('error', function () {
  throw new Error('unable to connect to database: ' + _env2.default.db);
});

var debug = require('debug')('express-mongoose-es6-rest-api:index');

// listen on port config.port
_express2.default.listen(_env2.default.port, function () {
  debug('server started on port ' + _env2.default.port + ' (' + _env2.default.env + ')');
});

exports.default = _express2.default;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map
