'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _util = require('../utils/util');

var _util2 = _interopRequireDefault(_util);

var _cache = require('../utils/cache');

var _cache2 = _interopRequireDefault(_cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// console.log(cache.TRIPS_TRUCKS);

// import globals from '../utils/globals';
var TripsSchema = new _base2.default({
   collection: 'Trips',
   schema: {
      /*
      define common, html-only, db-only properties
      grid-only columns - role based
      */
      /*
      role based permissions
      owner columns
      date columns
      link columns
       */
      username: {
         type: String,
         required: true,
         html: {},
         db: {},
         config: { //app based roles    
            trips_trucks: {
               roles: ['*']
            }
         }
      },
      mobileNumber: {
         type: String,
         required: true,
         match: [/^[1-9][0-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.'],
         config: {
            trips_trucks: {
               roles: _util2.default.setRoleDetails(_cache2.default.TRIPS_TRUCKS.ROLES.ADMIN, {
                  title: 'Phone Number'
               }).setRoleDetails(_cache2.default.TRIPS_TRUCKS.ROLES.TRUCK_USER, {
                  title: 'Mobile'
               })
            } //app based roles
         }
      }
   }
});
// console.log(utils.setObjectProperty('name', {key: 1}).setObjectProperty('age', 20));

// import tripsTrucks from '../applicationsConfig/trips_trucks.js';
exports.default = TripsSchema.getSchema();
module.exports = exports['default'];
//# sourceMappingURL=trips.js.map
