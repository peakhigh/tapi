"use strict";

Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.default = {
   cloneObject: function cloneObject(source, destination) {
      for (var prop in source) {
         if (source.hasOwnProperty(prop)) {
            destination[prop] = source[prop];
         }
      }
      return destination;
   },
   setObjectProperty: function setObjectProperty(key, value) {
      var obj = {};
      obj[key] = value;
      Object.prototype.setObjectProperty = function (k, v) {
         this[k] = v;
         return this;
      };
      return obj;
   }
};
module.exports = exports['default'];
//# sourceMappingURL=util.js.map
