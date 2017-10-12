let Schema = require('mongoose').Schema;
let authUtils = require('../../utils/auth');

const collection = 'Trips';
module.exports = {
   type: 'form',
   requestType: 'get',
   schemaFields: ['quotes.cost', 'paymentInfo.paymentlog'], // pick fields configuration from default schema
   schemaOverrideFeilds: {
      
   },
   get: {
      preValidate: (serviceConfig, req, res, options, cb) => {//on init hook, will get executed on service request - init
         console.log('get prevalidate');
         if (!req.params.id) {
            return cb('Invalid Request');//if error, return as first argument
         }
         return cb();
      },
      callback: (schema, serviceConfig, req, res, options, cb) => {//callback hook  - after serving the request - forms & grid
         console.log('get callback', req.params.id);
         if (req.params.id || req.query.id) {
            const model = require('mongoose').model(collection);
            let params = {
               id: req.params.id || req.query.id
            };
            model.getByIdWithFields(params, {
               fields: serviceConfig.schemaFields,
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
         /* if (!req.query.id) {
            return cb('Invalid Request');//if error, return as first argument
         } */
         return cb();//if error, return as first argument
      },
      callback: (serviceConfig, req, res, options, cb) => { //callback hook  for post request
         console.log('post callback');
         const model = require('mongoose').model(collection);        
         req.body.status = 'PaymentMade';
         model.editById(req.body, null, cb);
       }
   }
};