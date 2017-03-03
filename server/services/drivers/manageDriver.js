/* dont use imports, use require, because errors are coming when we are dynamically using services in the base model*/
let uiTypes = require('../../utils/ui-types');
let authUtils = require('../../utils/auth');
const collection = 'Drivers';
module.exports = {
   type: 'form',
   requestType: 'get',
   schemaFields: ['firstname', 'lastname', 'address', 'contact', 'photo', 'idproof'], // pick fields configuration from default schema
   get: {
       callback: (schema, serviceConfig, req, options, cb) => {//callback hook  - after serving the request - forms & grid
         console.log('get callback');
         const model = require('mongoose').model(collection);
         model.listFields(req.query, {
            selectFields: serviceConfig.schemaFields,
            response: {
               schema: schema
            }
         }, cb);
      }
   }
  };