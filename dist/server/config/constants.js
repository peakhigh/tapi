'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//TODO:: use singleton class 
var Constants = function Constants() {
  _classCallCheck(this, Constants);

  this.CONFIG_KEY_SEPERATOR = '#';
  this.CONFIG_KEY_FORM_SUFFIX = 'Form';
  this.CONFIG_KEY_GRID_SUFFIX = 'Grid';
  this.CONFIG_KEY_DB_SUFFIX = 'DB';
};

exports.default = new Constants();
module.exports = exports['default'];
//# sourceMappingURL=constants.js.map
