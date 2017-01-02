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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = require('../../config/env');

// sample user, used for authentication
var user = {
  username: 'react',
  password: 'express'
};

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  // Ideally you'll fetch this from the db
  // Idea here was to show how jwt works with simplicity
  if (req.body.username === user.username && req.body.password === user.password) {
    //add app also in authentication
    var token = _jsonwebtoken2.default.sign({
      username: user.username,
      role: 'ADMIN', //TODO:: get from DB
      app: _util2.default.getRequestOrigin(req.headers.origin)
    }, config.jwtSecret);
    return res.json({
      token: token,
      username: user.username
    });
  }

  var err = new _APIError2.default('Authentication error', _httpStatus2.default.UNAUTHORIZED);
  return next(err);
}

exports.default = { login: login };
module.exports = exports['default'];
//# sourceMappingURL=auth.js.map
