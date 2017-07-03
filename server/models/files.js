const BaseSchemaFactory = require('./base');
const utils = require('../utils/util');
let cache = require('../utils/cache');
let Schema = require('mongoose').Schema;

const CurrentSchema = new BaseSchemaFactory({ 
   collection: 'files',   
   schema: {
      createdby: {
         type: String,        //callcenter/tripadmin/truckadmin/
         required: true
      },
      recordid:{            //trip/truck/user ids
         type: String,
         required: true
      },
      originalname: {     //original filename uploaded
         type: String,
         required: true
      },
      mimetype: {            //pdf/jpeg/png
         type: String,
          required: true
      },
      path: {               //path in the server
         type: String,   
         required: true
      },
      typeofdocument: {     //photo,license,idproof,invoice,loaded doc,unloaded doc
         type: String,
         required: true
      }
   }
}); 
module.exports = CurrentSchema.getSchema();