const BaseSchemaFactory = require('./base');
const utils = require('../utils/util');
let cache = require('../utils/cache');
let Schema = require('mongoose').Schema;

const CurrentSchema = new BaseSchemaFactory({ 
   collection: 'Trucks',   
   schema: {
      plateNumber: {
         type: Schema.Types.String,
         required: true
      },
      licenseNumber: {
         type: Schema.Types.String,
         required: true
      },
      model: {
         type: Schema.Types.String,
         required: true
      },
      engineNumber: {
         type: Schema.Types.String,
         required: true
      },
      description: {
         type: Schema.Types.String,
         required: true
      },
      truckType: {
         type: Schema.Types.String,
         required: true
      },
      capacity: {
         type: Schema.Types.String,
         required: true
      },
      capacityUnits: {
         type: Schema.Types.String,
         required: true,
         enum: ['Tons'],
            html: {               
               form: {
                  type: 'select'
               }
         },
         default: 'tons' 
      },
      insurance: {
         startDate: {
            type: Date,
            setmin: false,
            required: true
         },
         expiryDate: {
            type: Date,
            setmin: false,
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
            type: Schema.Types.String,
            required: true
         },
         description: {
            type: Schema.Types.String,
            required: false
         }
      },
      driverId: {
         type: Schema.Types.ObjectId,
         required: false
      },
      status: {
         type: Schema.Types.String,
         required: true,
         enum: ['free', 'busy'],
         html: {               
               form: {
                  type: 'select'
               }
         },
         default: 'free'
      },
      nextFreeDate: {
         type: Date,
         required: false
      },
      nextAvailableAt: {   //location
         type: Schema.Types.String,
         required: false
      },
      rating: {
         type: Number,
         required: false
      },
      currentPoint: {
         type: Schema.Types.String, //TODO: change to lat, long + string
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