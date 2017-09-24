/* dont use imports, use require, because errors are coming when we are dynamically using services in the base model*/
let uiTypes = require('../../utils/ui-types');
let authUtils = require('../../utils/auth');
const collection = 'Requests';
module.exports = {
   type: 'form',
   requestType: 'get',
   schemaFields: ['quote', 'driverid', 'truckid', 'tripid', 'comment', 'fromUser', 'toUser', 'status'], // pick fields configuration from default schema
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
         console.log('get callback', schema);
         const model = require('mongoose').model(collection);
         if (req.params.id) {
            req.query.where = JSON.stringify({toUser:req.params.id}); 
             model.getByWhereWithFields(req.params, {
               response: {
                  schema: schema
               }
            }, cb);
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

          model.addOrEdit(req.body, null, cb);
         /*if (req.body._id) {
            let data = {
               _id: req.body._id
            };            
            model.editById(data, null, cb);
         } else {
            cb({});
         }*/
      }
   }
};