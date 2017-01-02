'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _env = require('../../config/env');

var _env2 = _interopRequireDefault(_env);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
   decodeToken: function decodeToken(requestHeaders) {
      //returns token details 
      if (requestHeaders && requestHeaders.authorization) {
         var tokenParts = requestHeaders.authorization.toString().trim().split(' ');
         if (tokenParts.length === 2) {
            return _jsonwebtoken2.default.verify(tokenParts[1], _env2.default.jwtSecret);
         }
      }
      return null;
   }
};
module.exports = exports['default'];
//# sourceMappingURL=auth.js.map
