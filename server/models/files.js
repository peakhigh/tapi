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
      path: {               //path in the server
         type: Schema.Types.String,   
         required: true
      },
      typeofdocument: {     //photo,license,idproof,invoice,loaded doc,unloaded doc
         type: Schema.Types.String,
         enum: ['License', 'Photo', 'LoadDoc', 'UnloadDoc', 'Other'],
         default: 'Other',
         required: true
      }
   }
}); 
module.exports = CurrentSchema.getSchema();