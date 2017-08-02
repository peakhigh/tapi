const BaseSchemaFactory = require('./base');
const utils = require('../utils/util');
let cache = require('../utils/cache');
const schemaUtils = require('../utils/schema');
let Schema = require('mongoose').Schema;

const CurrentSchema = new BaseSchemaFactory({ 
   collection: 'Drivers',   
   schema: {
      firstname: {
         type: Schema.Types.String,
         required: true
      },
      lastname: {
         type: Schema.Types.String,
         required: true
      },
      address: schemaUtils.address(),
      contact: schemaUtils.contact(false),
      rating: {
         type: Schema.Types.String
      }
   } 
}); 
module.exports = CurrentSchema.getSchema();