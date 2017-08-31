/* dont use imports, use require, because errors are coming when we are dynamically using services in the base model*/
let uiTypes = require('../../utils/ui-types');
let authUtils = require('../../utils/auth');
const collection = 'Drivers';
module.exports = {
   type: 'form',
   requestType: 'get',
   schemaFields: ['name', 'licenseNumber', 'licenseExpiryDate', 'experience', 'email', 'mobile',
   'alternativePhone', 'status'], // pick fields configuration from default schema
   get: {
       callback: (schema, serviceConfig, req, res, options, cb) => {//callback hook  - after serving the request - forms & grid
         console.log('get callback');
         const model = require('mongoose').model(collection);
         console.log(req.query);
         if (!req.query.querystr) {
            if (req.query.query) {
               req.query.where = JSON.stringify(req.query.query); 
            } else {
               req.query = {where: JSON.stringify({status: req.query.status})};
            }
         }
         model.listFields(req.query, {
            selectFields: serviceConfig.schemaFields,
            response: {
               schema: schema
            }
         }, cb);
      }
   }
  };