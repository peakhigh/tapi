/* dont use imports, use require, because errors are coming when we are dynamically using services in the base model*/
let uiTypes = require('../../utils/ui-types');
let authUtils = require('../../utils/auth');
const collection = 'Trips';
module.exports = {
   type: 'form',
   requestType: 'get',
   schemaFields: ['comments'], // pick fields configuration from default schema
   schemaOverrideFeilds: {
      comments: {
         required: true
      }

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
         const model = require('mongoose').model(collection);
         if (req.params.id) {
       /*        cb(null, {
               data:  {
                  _id: req.params.id,
                  comments: ''
               },
               schema: schema
            });  */
            
            if (!req.query.skip) {
               req.query.skip = 0;
               req.query.limit = 3;
            }
            console.log(req.query);
            let params = {
               id: req.params.id || req.query.id,
               slice: {
                  field: 'comments',
                  skip: req.query.skip,
                  limit: req.query.limit
               }
            };
         model.getByIdFieldsWithSlice(params, {
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
         console.log('post prevalidate addComment');
         if (!req.body._id) {
            return cb('Invalid Request');//if error, return as first argument
         }
         return cb();
      },
      callback: (serviceConfig, req, res, options, cb) => { //callback hook  for post request
         console.log('post callback');
         const model = require('mongoose').model(collection);
         console.log(req.body.comments);
         if (req.body.comments) {
            let data = {
               _id: req.body._id,
            };            

            let tokenDetails = authUtils.decodeToken(req.headers);
            let comment = {
                date: new Date().toLocaleString(),
                commentedby: tokenDetails.username,
                comment: req.body.comments[0].comment
             };
            data.$push = { comments: comment };

            model.editById(data, null, cb);
         } else {
            cb({});
         }
      }
   }
};