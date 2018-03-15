/* dont use imports, use require, because errors are coming when we are dynamically using services in the base model*/
let uiTypes = require('../../utils/ui-types');
let authUtils = require('../../utils/auth');
const extend = require('extend');
const collection = 'Drivers';
module.exports = {
   type: 'form',
   requestType: 'get',
   schemaFields: ['name', 'licenseNumber', 'licenseExpiryDate', 'experience', 'email', 'mobile',
                     'alternativePhone', 'status', 'profilePic'], // pick fields configuration from default schema
   schemaOverrideFeilds: {

   },
   defaults: {
      status: 'Free'
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
         console.log('get callback', schema);
         const model = require('mongoose').model(collection);
         if (req.params.id) {
             model.getById(req.params, {
               response: {
                  schema: schema
               }
            }, cb);
            //cb(null, schema);
         } else {
            cb(null, schema);
         }
      }
   },
   post: {
      preValidate: (serviceConfig, req, res, options, cb) => { //on post - validate, will get executed on POST service request
         console.log('post prevalidate');
        /* if (!req.body._id) {
            return cb('Invalid Request');//if error, return as first argument
         }*/
         return cb();
      },
      callback: (serviceConfig, req, res, options, cb) => { //callback hook  for post request
         console.log('post callback');
         const model = require('mongoose').model(collection);

         let owner = JSON.parse(req.headers.owner);
         if (owner !== null && owner.role !== 'CALL_CENTER_USER') {
            let obj = {
               createdBy : owner._id,
               /* 'updatedby' : req.headers.owner._id, */
            };
            extend(true, req.body, obj);
        } else {
           return cb('no owener info');
        }

          model.addOrEdit(req.body, null, cb);
      }
   }
};