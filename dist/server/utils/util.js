'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _globals = require('./globals');

var _globals2 = _interopRequireDefault(_globals);

var _env = require('../../config/env');

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
   cloneObject: function cloneObject(source, destination) {
      for (var prop in source) {
         if (source.hasOwnProperty(prop)) {
            destination[prop] = source[prop];
         }
      }
      return destination;
   },
   setRoleDetails: function setRoleDetails(key, value) {
      var obj = {};
      obj[key] = value;
      obj.setRoleDetails = function (k, v) {
         this[k] = v;
         return this;
      };
      return obj;
   },
   defineAppConfig: function defineAppConfig(appName, appConfig) {
      _globals2.default.defineGlobal(appName, appConfig, true, true);
   },
   getURLDetails: function getURLDetails(url) {
      var match = url.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
      return match && {
         protocol: match[1],
         host: match[2],
         hostname: match[3],
         port: match[4],
         pathname: match[5],
         search: match[6],
         hash: match[7]
      };
   },
   getRequestOrigin: function getRequestOrigin(url) {
      if (!url) {
         return '';
      }
      var startIndex = url.indexOf('://') + 3;
      var endIndex = url.indexOf(':', startIndex);
      if (endIndex < 0) {
         endIndex = url.indexOf('/', startIndex);
         if (endIndex < 0) {
            endIndex = url.length - 1;
         }
      }
      var retVal = url.trim().substring(startIndex, endIndex);
      if (retVal === 'localhost') {
         return _env2.default.defaultapp;
      }
      return retVal;
   }
};
module.exports = exports['default'];
//# sourceMappingURL=util.js.map
