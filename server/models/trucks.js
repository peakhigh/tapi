const BaseSchemaFactory = require('./base');
const utils = require('../utils/util');
let cache = require('../utils/cache');
let Schema = require('mongoose').Schema;

const CurrentSchema = new BaseSchemaFactory({ 
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
      material : {        
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
module.exports = CurrentSchema.getSchema();