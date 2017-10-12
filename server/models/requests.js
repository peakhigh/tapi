//Requests, Reviews, Messages, Rating
const BaseSchemaFactory = require('./base');
const utils = require('../utils/util');
let cache = require('../utils/cache');
const schemaUtils = require('../utils/schema');
let Schema = require('mongoose').Schema;

const CurrentSchema = new BaseSchemaFactory({ 
   collection: 'Requests',   
   schema: {
      comment: {
         type: Schema.Types.String
      },
      tripDetails: {  
         type: Schema.Types.ObjectId, 
         ref: 'Trips'
      }, 
      truckDetails: {
         type: Schema.Types.ObjectId, 
         ref: 'Trucks',
      },
      driverDetails: {
         type: Schema.Types.ObjectId, 
         ref: 'Drivers',
      },
      fromUser: {
            type: Schema.Types.ObjectId
      },
      toUser: {
         type: Schema.Types.ObjectId
      },
      status: {
         type: Schema.Types.String,
         enum: ['Accepted', 'Rejected', 'Pending'],
         default: 'Pending'
      },
      advance: {
         type: Schema.Types.Number
      },
      balance: {
         type: Schema.Types.Number
      },
   } 
}); 
module.exports = CurrentSchema.getSchema();