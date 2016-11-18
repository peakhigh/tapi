'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _globals = require('../utils/globals');

var _globals2 = _interopRequireDefault(_globals);

var _util = require('../utils/util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
               roles: ['*'],
               role_config: {}
            }
         }
      },
      mobileNumber: {
         type: String,
         required: true,
         match: [/^[1-9][0-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.'],
         config: {
            trips_trucks: {}
            // roles: utils.setObjectProperty('name', {key: 1}).setObjectProperty('age', 20)
            // roles: [globals.trips_trucks_ROLES.ADMIN.Code],
            // role_config: (() => {
            //    let config = {};
            //    config[globals.trips_trucks_ROLES.ADMIN.Code] = {
            //       title: 'Phone Number'
            //    };
            //    return config;    
            // })()
            //app based roles
         }
      }
   }
});
exports.default = TripsSchema.getSchema();
module.exports = exports['default'];
//# sourceMappingURL=trips.js.map
