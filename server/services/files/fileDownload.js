/* dont use imports, use require, because errors are coming when we are dynamically using services in the base model*/
let uiTypes = require('../../utils/ui-types');
let authUtils = require('../../utils/auth');

const fs = require('fs');

const collection = 'files';
module.exports = {
   type: 'form',
   requestType: 'get',
   schemaFields: ['createdby', 'recordid', 'originalname', 'mimetype', 'path', 'typeofdocument'], // pick fields configuration from default schema
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
         //console.log('get callback', schema);
         const model = require('mongoose').model(collection);
         if (req.params.id) {
         /*where: {recordid : req.params.id}*/
            //console.log(JSON.parse());
            model.getByIdWithFields(req.params, {
            selectFields: serviceConfig.schemaFields,
            response: {
               schema: schema
            }
         }, (error, data) => {  
                return cb(null, data);
            });
         } else {
            cb(null, schema);
         }
      }
   },
};