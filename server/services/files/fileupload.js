/* dont use imports, use require, because errors are coming when we are dynamically using services in the base model*/
let uiTypes = require('../../utils/ui-types');
let authUtils = require('../../utils/auth');

const multer = require('multer');
//const uplo   ad = multer({ dest: 'uploads/' }).array('photos', 3);
//const upload = multer({ dest: 'uploads/' }).array('photos', 3);
const upload = multer({ dest: 'uploads/' }).single('qqfile');
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
        /* if (!req.params.id) {
            return cb('Invalid Request');//if error, return as first argument
         }*/
         return cb();
      },
      callback: (schema, serviceConfig, req, res, options, cb) => {//callback hook  - after serving the request - forms & grid
         //console.log('get callback', schema);
         const model = require('mongoose').model(collection);
         if (req.params.id) {           
            req.query.where = {};
            req.query.where = JSON.stringify({recordid : req.params.id});
            model.listFields(req.query, {
            selectFields: serviceConfig.schemaFields,
            response: {
               schema: schema
            }
         }, (error, data) => {
                data.id = req.params.id;
                return cb(null, data);
            });
         } else {
            cb(null, schema);
         }
      }
   },
   post: {
      preValidate: (serviceConfig, req, res, options, cb) => { //on post - validate, will get executed on POST service request
         console.log('post prevalidate');
         if (!req.query.id) {
            return cb('Invalid Request');//if error, return as first argument
         }
         return cb();
      },
      callback: (serviceConfig, req, res, options, cb) => { //callback hook  for post request
         console.log('post callback');
         const model = require('mongoose').model(collection);
         upload(req, cb, (err) => {
            if (err) {
               console.log(err);
               //return cb('max 3 docs can upload'); 
               res.send(JSON.stringify({success: false, error: err}), {'Content-Type': 'text/plain'}, 404);
            }
               let doc = {
                  createdby: req.user,
                  recordid: req.query.id,
                  originalname: req.file.originalname,
                  mimetype: req.file.mimetype,
                  path: req.file.path,
                  typeofdocument: req.query.type
               };
               model.addOrEdit(doc, null, cb);
           // cb('OK');
         });
      }
   },
    delete: {
      preValidate: (serviceConfig, req, res, options, cb) => {//on init hook, will get executed on service request - init
         console.log('delete prevalidate ');
         if (!req.query.id) {
            return cb('Invalid Request');//if error, return as first argument
         }
         return cb();
      },
      callback: (serviceConfig, req, res, options, cb) => {//callback hook  - after serving the request - forms & grid
         console.log('delete callback');
         const model = require('mongoose').model(collection);
         if (req.query.id) {
            //first remove from the database
            model.removeById({id: req.query.id}, {fields: serviceConfig.schemaFields}, (error, data) => {
                if (!error) {
                  //delete file locally
                   fs.stat(data.path, (err, stats) => {
                  //   console.log(stats);//here we got all information of file in stats variable
                     if (err) {
                         return console.error(err);
                     }
                     fs.unlink(data.path, (err1) => {
                          if (err1) return console.log(err1);
                          console.log('file deleted successfully');
                     });  
                  });
                }
                
                data.id = req.query.id;
                return cb(null, data);
            });
         } else {
            cb('Invalid Request');
         }
      }
   },
};
