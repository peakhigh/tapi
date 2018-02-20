//Requests, Reviews, Messages, Rating
const BaseSchemaFactory = require('./base');
const utils = require('../utils/util');
let cache = require('../utils/cache');
const schemaUtils = require('../utils/schema');
const schemaTypeUtils = require('../utils/schema-types');
let Schema = require('mongoose').Schema;

const CurrentSchema = new BaseSchemaFactory({ 
   collection: 'Payments',   
   schema: {
      tripid: {  
         type: Schema.Types.ObjectId
      }, 
      truckid: {
         type: Schema.Types.ObjectId
      },
      driverid: {
         type: Schema.Types.ObjectId
      },
      payer: {
            type: Schema.Types.String
      },
      payee: {
         type: Schema.Types.String
      }, 
      transferType: {
         type: Schema.Types.String,
         enum: ['InComing', 'OutGoing'],
         required: true
      },
      amount: {
         type: Schema.Types.Number,
         required: true
      },
      status: {
         type: Schema.Types.String,
         enum: ['Pending', 'Approved', 'Declined'],
         default: 'Pending',
         required: true
      },
      modeOfPayment: {
         type: Schema.Types.String,
         enum: ['Online', 'BankDeposit', 'Cash'],
         required: true,
         html: {               
            form: {
               type: 'select'
            }
         }  
      },
      dateOfPayment: schemaTypeUtils.date(false, {
         title: 'Date & Time'
      }),
      transactionid: {
         type: Schema.Types.String
      },
      referenceDoc: {
         type: Schema.Types.String
      }
   } 
}); 
module.exports = CurrentSchema.getSchema();