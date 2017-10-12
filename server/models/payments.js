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
      amountTotal: {
         type: Schema.Types.String
      },
      duedate: schemaTypeUtils.date(false, {
         title: 'Date & Time'
      }),
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
         enum: ['Paid', 'Received', 'Pending', 'PendingPayments', 'PendingReceivable'],
         default: 'Pending'
      },
      paymentlog: [{
         amountPaid: {
            type: Schema.Types.Number
         },
         modeOfPayment: {
            type: Schema.Types.String,
            enum: ['Online', 'BankDeposit'],
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
      }]
   } 
}); 
module.exports = CurrentSchema.getSchema();