/* dont use imports, use require, because errors are coming when we are dynamically using services in the base model*/
let uiTypes = require('../../utils/ui-types');
let authUtils = require('../../utils/auth');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }).array('photos', 3);

const collection = 'files';
module.exports = {
   type: 'form',
   requestType: 'get',
   schemaFields: ['createdby', 'recordid', 'originalname', 'mimetype', 'path', 'typeofdocument'], // pick fields configuration from default schema
   schemaOverrideFeilds: {

   },
   get: {
      preValidate: (serviceConfig, req, options, cb) => {//on init hook, will get executed on service request - init
         console.log('get prevalidate');
        /* if (!req.params.id) {
            return cb('Invalid Request');//if error, return as first argument
         }*/
         return cb();
      },
      callback: (schema, serviceConfig, req, options, cb) => {//callback hook  - after serving the request - forms & grid
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
      preValidate: (serviceConfig, req, options, cb) => { //on post - validate, will get executed on POST service request
         console.log('post prevalidate');
         if (!req.query.id) {
            return cb('Invalid Request');//if error, return as first argument
         }
         return cb();
      },
      callback: (serviceConfig, req, options, cb) => { //callback hook  for post request
         console.log('post callback');
         const model = require('mongoose').model(collection);
        
         upload(req, cb, (err) => {
            if (err) {
               return cb('max 3 docs can upload'); 
            }
            
               for (let item in req.files) {
                  if (item) {
                     let doc = {
                        createdby: 'not now',
                        recordid: req.query.id,
                        originalname: req.files[item].originalname,
                        mimetype: req.files[item].mimetype,
                        path: req.files[item].path,
                        typeofdocument: 'not now'
                     };
                     model.addOrEdit(doc, null, cb);
                   //  console.log(req.files[item]);
                  }
               }
           
            cb('OK');
         });
      }
   }
};