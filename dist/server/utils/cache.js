'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // let instance = null;
// class Cache {
//   constructor() {
//     if (!instance) { instance = this; }
//     this.time = new Date();

//     return instance;
//   }
// }

// export default { instance }

//TODO:: use singleton class and load all appconfigs only once
//TODO:: load app configs from the applicationConfig directory 
//automate it in the constructor


var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cache = function () {
   function Cache() {
      _classCallCheck(this, Cache);

      //TODO:: everything should be json files from applicationConfig directory
      this.APP_CONFIG = {};
      this.APP_CONFIG.TRIPS_TRUCKS = {
         ROLES: {
            ADMIN: {
               Id: 1,
               Code: 'ADMIN'
            },
            TRUCK_USER: {
               Id: 2,
               Code: 'TRUCK_USER'
            },
            TRUCK_OWNER: {
               Id: 3,
               Code: 'TRUCK_OWNER'
            },
            BROKER: {
               Id: 4,
               Code: 'BROKER'
            },
            CALL_CENTER_USER: {
               Id: 5,
               Code: 'CALL_CENTER_USER'
            }
         }
      };
   }

   _createClass(Cache, [{
      key: 'updateSchemaStore',
      value: function updateSchemaStore(roleBasedSchemas) {
         if (!this.SCHEMA_STORE) {
            //schema store contains all the schemas per html(form, grid) per db per role per app per collection like a key value 
            this.SCHEMA_STORE = {};
         }
         //key strucrure
         //for form => appKey + sep + role.Code + sep + collection_name + sep + CONFIG_KEY_FORM_SUFFIX
         //for grid => appKey + sep + role.Code + sep + collection_name + sep + CONFIG_KEY_GRID_SUFFIX
         //for db => appKey + sep + role.Code + sep + collection_name + sep + CONFIG_KEY_DB_SUFFIX
         _util2.default.cloneObject(roleBasedSchemas, this.SCHEMA_STORE);
      }
   }]);

   return Cache;
}();

exports.default = new Cache();
module.exports = exports['default'];
//# sourceMappingURL=cache.js.map
