/* dont use imports, use require, because errors are coming when we are dynamically using services in the base model*/
let uiTypes = require('../../utils/ui-types');
let authUtils = require('../../utils/auth');
const extend = require('extend');
const collection = 'Requests';
module.exports = {
   type: 'form',
   requestType: 'get',
   schemaFields: ['advance', 'balance', 'driverDetails', 'truckDetails', 'tripDetails', 'comment', 'fromUser', 'toUser', 'status'], // pick fields configuration from default schema
   schemaOverrideFeilds: {

   },
   get: {
      preValidate: (serviceConfig, req, res, options, cb) => {//on init hook, will get executed on service request - init
         console.log('get prevalidate');
        /* if (!req.params.id) {
            return cb('Invalid Request');//if error, return as first argument
         }*/
         return cb();
      },
      callback: (schema, serviceConfig, req, res, options, cb) => {//callback hook  - after serving the request - forms & grid
         console.log('get callback');
         const model = require('mongoose').model(collection);
         console.log(req.query);
         let where = {};
         if (!req.query.querystr) {
            if (req.query.query) {
               where = req.query.query; 
            } else {
               where = {status: req.query.status};
            }
         }
 
         let owner = JSON.parse(req.headers.owner);
         if (owner !== null && owner.role !== 'CALL_CENTER_USER') {
            let obj = {
               toUser : owner._id,
               /* 'updatedby' : req.headers.owner._id, */
            };
            extend(true, where, obj);
        }

         req.query.where = JSON.stringify(where);
         
         model.listFields(req.query, {
            selectFields: serviceConfig.schemaFields,
            populateFields: 'tripDetails',
            response: {
               schema: schema
            }
         }, cb);
      }
}
};