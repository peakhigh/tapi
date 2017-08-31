const BaseSchemaFactory = require('./base');
const utils = require('../utils/util');
let cache = require('../utils/cache');
const schemaUtils = require('../utils/schema');
const schemaTypes = require('../utils/schema-types');
let Schema = require('mongoose').Schema;

const CurrentSchema = new BaseSchemaFactory({ 
   collection: 'Accounts',   
   schema: {
      userid: {
         type: String,
         required: true
      },
      accountNumber: {
         type: String,
         required: true
      },
      accountName: {
         type: String,
         required: true
      },
      bankName: {
         type: String,
         required: true
      },
      ifscCode: {
         type: String,
         required: true
      },
      branchAddress: {
         type: String,
         required: true
      }
   } 
}); 
module.exports = CurrentSchema.getSchema();