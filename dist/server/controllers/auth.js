'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _APIError = require('../helpers/APIError');

var _APIError2 = _interopRequireDefault(_APIError);

var _util = require('../utils/util');

var _util2 = _interopRequireDefault(_util);

var _cache = require('../utils/cache');

var _cache2 = _interopRequireDefault(_cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = require('../../config/env');

// sample user, used for authentication
var callcenterUser = {
  username: 'callcenter',
  password: '12345',
  role: 'CALL_CENTER_USER',
  firstName: 'Call',
  lastName: 'Center'
};

var truckUser = {
  username: 'trip',
  password: '12345',
  role: 'TRUCK_USER',
  firstName: 'Truck',
  lastName: 'User'
};

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  /** TODO: read from DB */
  var userRecord = void 0;
  if (req.body.username === callcenterUser.username && req.body.password === callcenterUser.password) {
    userRecord = callcenterUser;
  } else if (req.body.username === truckUser.username && req.body.password === truckUser.password) {
    userRecord = truckUser;
  }
  var app = _util2.default.getRequestOrigin(req.headers.origin);

  if (userRecord) {
    var token = _jsonwebtoken2.default.sign({
      username: userRecord.username,
      role: userRecord.role,
      app: app
    }, config.jwtSecret);
    return res.json({
      token: token,
      user: {
        username: userRecord.username,
        role: userRecord.role,
        name: userRecord.firstName + ' ' + userRecord.lastName,
        menu: _cache2.default.APP_CONFIG[app.toUpperCase()].ROLES[userRecord.role.toUpperCase()].Menu
      }
    });
  }

  var err = new _APIError2.default('Authentication error', _httpStatus2.default.UNAUTHORIZED);
  return next(err);
}

exports.default = { login: login };
module.exports = exports['default'];
//# sourceMappingURL=auth.js.map
