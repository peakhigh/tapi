'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

var _auth = require('./auth');

var _auth2 = _interopRequireDefault(_auth);

var _trips = require('./trips');

var _trips2 = _interopRequireDefault(_trips);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', function (req, res) {
  return res.send('OK');
});

// mount user routes at /users
router.use('/users', _user2.default);

// mount user routes at /users
router.use('/trips', _trips2.default);

// mount auth routes at /auth
router.use('/auth', _auth2.default);

exports.default = router;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map
