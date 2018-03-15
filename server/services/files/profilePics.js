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
   post: {
      preValidate: (serviceConfig, req, res, options, cb) => { //on post - validate, will get executed on POST service request
         console.log('post prevalidate');
          if (!req.query.userid || !req.query.type) {
            return cb('Invalid Request no userID');//if error, return as first argument
         } 
         return cb();
      },
      callback: (serviceConfig, req, res, options, cb) => { //callback hook  for post request
         console.log('post callback');
         const model = require('mongoose').model(req.query.type);  //req.query.type Users or Drivers
         const upload = multer({
            storage: multerS3({
                s3: s3,
                bucket: 'tripstrucksfiles/profilepics',
                acl: 'public-read',
                key: function (request, file, cba) {
                    cba(null, req.query.userid); 
                }
            })
         }).single('qqfile');
         
          upload(req, cb, (err) => {
            if (err) {
               console.log(err);
               res.send(JSON.stringify({success: false, error: err}), {'Content-Type': 'text/plain'}, 404);
            }
            
                let doc = {
                   _id: req.query.userid,
                  profilePic: req.file.location,
               };
              
               model.addOrEdit(doc, null, cb);        
         }); 
      }
   }
};
