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
      type: {
         type: Schema.Types.String,
         enum: ['Bid', 'Message', 'Ticket', 'Review', 'Rating'],
         required: true
      },
      itemId: {   //trip or truck id
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
         enum: ['New', 'Saved', 'Rejected', 'Approved', 'closed']
      },
      priceQuote: {
         type: Schema.Types.Number
      },
      rating: {
         type: Schema.Types.String
      }
   } 
}); 
module.exports = CurrentSchema.getSchema();