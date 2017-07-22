/* dont use imports, use require, because errors are coming when we are dynamically using services in the base model*/
let uiTypes = require('../../utils/ui-types');
let authUtils = require('../../utils/auth');
const collection = 'Trips';
module.exports = {
   type: 'form',
   requestType: 'get',
   schemaFields: ['truckDetails'], // pick fields configuration from default schema
   schemaOverrideFeilds: {
      truckDetails: {
         required: true
      }
   },
   get: {
      preValidate: (serviceConfig, req, options, cb) => {//on init hook, will get executed on service request - init
         console.log('get prevalidate');
         if (!req.params.id) {
            return cb('Invalid Request');//if error, return as first argument
         }
         return cb();
      },
      callback: (schema, serviceConfig, req, options, cb) => {//callback hook  - after serving the request - forms & grid
         console.log('get callback', req.params.id);
         const model = require('mongoose').model(collection);
         if (req.params.id) {
            cb(null, {
               data:  {
                  _id: req.params.id
               },
               schema: schema
            });
         } else {
            cb(null, schema);
         }
      }
   },
    post: {
      preValidate: (serviceConfig, req, options, cb) => { //on post - validate, will get executed on POST service request
         console.log('post prevalidate');
         if (!req.query.id) {
            return cb('Invalid Request');//if error, return as first argument
         }
         return cb();//if error, return as first argument
      },
      callback: (serviceConfig, req, options, cb) => { //callback hook  for post request
         console.log('post callback');
         const model = require('mongoose').model(collection);    
         
         let data = {
            _id: req.query.id,
             truckDetails: req.body.truckDetails
            };            
            model.editById(data, null, cb);
       }
   }
};