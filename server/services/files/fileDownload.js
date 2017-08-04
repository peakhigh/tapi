/* dont use imports, use require, because errors are coming when we are dynamically using services in the base model*/
let uiTypes = require('../../utils/ui-types');
let authUtils = require('../../utils/auth');

const fs = require('fs');
const mime = require('mime');
const path = require('path');

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
         if (!req.query.id) {
            return cb('Invalid Request');//if error, return as first argument
         }
         return cb();
      },
      callback: (schema, serviceConfig, req, res, options, cb) => {//callback hook  - after serving the request - forms & grid

         const model = require('mongoose').model(collection);
         let where = {id:req.query.id};
         model.getById(where, {}, (error, data) => {
               console.log(data);
                let file = data.path;

               let filename = path.basename(file);
               let mimetype = mime.lookup(file);

               res.setHeader('Content-disposition', 'attachment; filename=test.pdf');
               res.setHeader('Content-type', mimetype);
               res.setHeader('Set-Cookie', 'fileDownload=true; path=/');
               res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

               let filestream = fs.createReadStream(file);
               filestream.pipe(res);
              // res.download(data.path);       
         });
      }
   },
};