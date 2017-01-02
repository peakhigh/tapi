'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _trucks = require('../controllers/trucks');

var _trucks2 = _interopRequireDefault(_trucks);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var baseRoute = new _base2.default({ controller: _trucks2.default });

exports.default = baseRoute.router;
module.exports = exports['default'];
//# sourceMappingURL=trucks.js.map
