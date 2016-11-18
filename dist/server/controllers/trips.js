'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _trips = require('../models/trips');

var _trips2 = _interopRequireDefault(_trips);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var currentModel = new _base2.default({ model: _trips2.default });

exports.default = { currentModel: currentModel };
module.exports = exports['default'];
//# sourceMappingURL=trips.js.map
