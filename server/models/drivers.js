const BaseSchemaFactory = require('./base');
const utils = require('../utils/util');
let cache = require('../utils/cache');
const schemaUtils = require('../utils/schema');
const schemaTypes = require('../utils/schema-types');
let Schema = require('mongoose').Schema;

const CurrentSchema = new BaseSchemaFactory({ 
   collection: 'Drivers',   
   schema: {
      name: {
         type: Schema.Types.String,
         required: true
      },
      licenseNumber: {
         type: Schema.Types.String,
         required: true
      },
      licenseExpiryDate:schemaTypes.date(false, {
         title: 'Date & Time'
      }),
      experience: {
         type: Schema.Types.Number
      },
      email: schemaTypes.email(), 
      mobile: schemaTypes.mobile(),
      alternativePhone: schemaTypes.mobile(),
      status: {
         type: Schema.Types.String,
         required: true,
         enum: ['Assigned', 'Free', 'Deactivated'],
         html: {               
               form: {
                  type: 'select'
               }
         },
         default: 'Free'
      }
   } 
}); 
module.exports = CurrentSchema.getSchema();