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

var Schema = require('mongoose').Schema;

var CurrentSchema = new _base2.default({
   collection: 'Trucks',
   schema: {
      plateNumber: {
         type: String,
         required: true
      },
      licenseNumber: {
         type: String,
         required: true
      },
      model: {
         type: String,
         required: true
      },
      engineNumber: {
         type: String,
         required: true
      },
      description: {
         type: String,
         required: true
      },
      truckType: {
         type: String,
         required: true
      },
      capacity: {
         type: String,
         required: true
      },
      capacityUnits: {
         type: String,
         required: true
      },
      insurance: {
         startDate: {
            type: Date,
            required: true
         },
         expiryDate: {
            type: Number,
            required: true
         },
         coverDetails: {
            type: String,
            required: false
         },
         coverAmount: {
            type: String,
            required: true
         }
      },
      material: {
         materialType: {
            type: String,
            required: true
         },
         description: {
            type: String,
            required: false
         }
      },
      driverId: {
         type: Schema.Types.ObjectId,
         required: false
      },
      status: {
         type: String,
         required: true,
         default: 'Unassigned'
      },
      nextFreeDate: {
         type: Date,
         required: false
      },
      nextAvailableAt: {
         type: Date,
         required: false
      },
      rating: {
         type: Number,
         required: false
      },
      currentPoint: {
         type: String, //TODO: change to lat, long + string
         required: false
      },
      nextAssignedDate: {
         type: Date,
         required: false
      }
   },
   gridAttributes: ['title']
});
exports.default = CurrentSchema.getSchema();
module.exports = exports['default'];
//# sourceMappingURL=trucks.js.map
