'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _globals = require('./globals');

var _globals2 = _interopRequireDefault(_globals);

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
      console.log('.................', appName);
      _globals2.default.defineGlobal(appName, appConfig, true, true);
      console.log('.................', _globals2.default.TRIPS_TRUCKS);
   }
};
module.exports = exports['default'];
//# sourceMappingURL=util.js.map
