/* dont use imports, use require, because errors are coming when we are dynamically using services in the base model*/
let uiTypes = require('../../utils/ui-types');
let authUtils = require('../../utils/auth');

const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const fs = require('fs');

let s3config = require('./s3_config.json');

const s3 = new aws.S3({
   accessKeyId: s3config.accessKeyId,
   secretAccessKey: s3config.secretAccessKey,
   region: s3config.region
});

const collection = 'files';
module.exports = {
   type: 'form',
   requestType: 'get',
   schemaFields: ['createdby', 'recordid', 'originalname', 'mimetype', 'path', 'typeofdocument', 
            'bucket', 'key', 'size'], // pick fields configuration from default schema
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

         let bucketname = `tripstrucksfiles/docs/${req.query.id}`;  //tripid
         const upload = multer({
            storage: multerS3({
                s3: s3,
                bucket: bucketname,
                key: function (request, file, cba) {
                    cba(null, `${Date.now()}_${file.originalname}`); //use Date.now() for unique file keys
                }
            })
         }).single('qqfile');
         
          upload(req, cb, (err) => {
            if (err) {
               console.log(err);
               res.send(JSON.stringify({success: false, error: err}), {'Content-Type': 'text/plain'}, 404);
            }

           //  console.log(req);
                let doc = {
                  createdby: req.user,
                  recordid: req.query.id,
                  originalname: req.file.originalname,
                  mimetype: req.file.mimetype,
                  key: req.file.key,
                  location: req.file.location,
                  bucket: req.file.bucket,
                  size: req.file.size,
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
                  //Delete from the Amazon s3
                   let params = {
                     Bucket: data.bucket,
                     Key: data.key
                   };
               
                  s3.deleteObject(params, (err, dat) => {
                     if (err) console.log(err);     
                     else console.log(dat);   
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
