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
var CurrentSchema = new _base2.default({
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
         db: {}
      },
      mobileNumber: {
         type: String,
         required: true,
         match: [/^[1-9][0-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.'],
         config: { //if config, it is considered same for all roles
            trips_trucks: {
               html: { //if html specific not mentioned, it is considered same for all roles
                  roles: ['*'],
                  roles_config: _util2.default.setRoleDetails(_cache2.default.APP_CONFIG.TRIPS_TRUCKS.ROLES.ADMIN.Code, {
                     title: 'Phone Number'
                  }).setRoleDetails(_cache2.default.APP_CONFIG.TRIPS_TRUCKS.ROLES.TRUCK_USER.Code, {
                     title: 'Mobile'
                  })
               },
               db: { //if db specific not mentioned, it is considered same for all roles
                  roles: ['*']
               }
            } //app based roles
         }
      }
   },
   gridAttributes: ['title']
});
// console.log(utils.setObjectProperty('name', {key: 1}).setObjectProperty('age', 20));

// import tripsTrucks from '../applicationsConfig/trips_trucks.js';
exports.default = CurrentSchema.getSchema();
module.exports = exports['default'];
//# sourceMappingURL=trips.js.map
