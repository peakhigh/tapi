//Requests, Reviews, Messages, Rating
const BaseSchemaFactory = require('./base');
const utils = require('../utils/util');
let cache = require('../utils/cache');
const schemaUtils = require('../utils/schema');
let Schema = require('mongoose').Schema;

const CurrentSchema = new BaseSchemaFactory({ 
   collection: 'Requests',   
   schema: {
      message: {
         type: Schema.Types.String
      },
      tripid: {  
         type: Schema.Types.ObjectId
      }, 
      truckid: {
         type: Schema.Types.ObjectId
      },
      driverid: {
         type: Schema.Types.ObjectId
      },
      fromUser: {
            type: Schema.Types.String
      },
      toUser: {
         type: Schema.Types.String
      },
      status: {
         type: Schema.Types.String,
         enum: ['Accepted', 'Rejected', 'Pending']
      },
      priceQuote: {
         type: Schema.Types.Number
      }
   } 
}); 
module.exports = CurrentSchema.getSchema();