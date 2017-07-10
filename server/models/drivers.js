const BaseSchemaFactory = require('./base');
const utils = require('../utils/util');
let cache = require('../utils/cache');
const schemaUtils = require('../utils/schema');
let Schema = require('mongoose').Schema;

const CurrentSchema = new BaseSchemaFactory({ 
   collection: 'Drivers',   
   schema: {
      firstname: {
         type: String,
         required: true
      },
      lastname: {
         type: String,
         required: true
      },
      address: schemaUtils.address(),
      contact: schemaUtils.contact(false),
      rating: {
         type: String,
         required: true
      }
   } 
}); 
module.exports = CurrentSchema.getSchema();