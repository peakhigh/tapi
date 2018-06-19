const BaseSchemaFactory = require('./base');
const utils = require('../utils/util');
let cache = require('../utils/cache');
let Schema = require('mongoose').Schema;

const CurrentSchema = new BaseSchemaFactory({ 
   collection: 'files',   
   schema: {
      createdby: {
         type: Schema.Types.String,        //callcenter/tripadmin/truckadmin/
         required: true
      },
      recordid:{            //trip/truck/user ids
         type: Schema.Types.String,
         required: true
      },
      originalname: {     //original filename uploaded
         type: Schema.Types.String,
         required: true
      },
      mimetype: {            //pdf/jpeg/png
         type: Schema.Types.String,
          required: true
      },
      size: {            //size of the object
         type: Schema.Types.Number
      },
      path: {               //path in the server
         type: Schema.Types.String,   
      },
      key: {               //key value in the server
         type: Schema.Types.String,   
         required: true
      },
      bucket: {               //bucket name in the s3
         type: Schema.Types.String,   
         required: true
      },
      location: {               //location in the s3
         type: Schema.Types.String,   
         required: true
      },
      typeofdocument: {     //photo,license,idproof,invoice,loaded doc,unloaded doc
         type: Schema.Types.String,
         default: 'Other',
         required: true
      }
   }
}); 
module.exports = CurrentSchema.getSchema();