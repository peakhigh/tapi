/* dont use imports, use require, because errors are coming when we are dynamically using services in the base model*/
let uiTypes = require('../../utils/ui-types');
let authUtils = require('../../utils/auth');

const fs = require('fs');
const mime = require('mime');
const path = require('path');

const collection = 'files';

const aws = require('aws-sdk');
let s3config = require('./s3_config.json');

const s3 = new aws.S3({
   accessKeyId: s3config.accessKeyId,
   secretAccessKey: s3config.secretAccessKey,
   region: s3config.region
});

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
         if (!req.query.id) {
            return cb('Invalid Request');//if error, return as first argument
         }
         return cb();
      },
      callback: (schema, serviceConfig, req, res, options, cb) => {//callback hook  - after serving the request - forms & grid

         const model = require('mongoose').model(collection);
         let where = {id:req.query.id};
         model.getById(where, {}, (error, data) => {                  
              let params = {
               Bucket: data.bucket,
               Key: data.key,
               Expires: 120     //120 seconds
             };
           let link = s3.getSignedUrl('getObject', params);
           return cb(null, {url:link});
         });
      }
   },
};