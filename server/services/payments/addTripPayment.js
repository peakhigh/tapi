/* dont use imports, use require, because errors are coming when we are dynamically using services in the base model*/
let uiTypes = require('../../utils/ui-types');
const extend = require('extend');
// let ObjectID = require('mongodb').ObjectID;
// const model = require('../../models/trips'); -- wont work as this file is required on model creation
const collection = 'Payments';
module.exports = {
   type: 'form',
   requestType: 'get',
   schemaFields: ['amount', 'tripid', 'truckid', 'transferType', 
   'status', 'modeOfPayment', 'dateOfPayment', 'transactionid', 'referenceDoc'],
   schemaOverrideFeilds: {
   
   }, //override above listed schema fields         
   prepare: (cacheKey, schema, serviceConfig) => { //on schema prepare - sync call
      //add any extra fields which are not in schema etc, default values etc
      //can do based on role, app etc by using the "cacheKey"
      //cacheKey format 'TRIPS_TRUCKS#ADMIN#TRIPS#FORM#ADDTRIP'

      // console.log(cacheKey); 
      // console.log(schema); 
   },
   get: {
      preValidate: (serviceConfig, req, res, options, cb) => {//on init hook, will get executed on service request - init
         console.log('get prevalidate');
         cb();//if error, return as first argument
      },
      callback: (schema, serviceConfig, req, res, options, cb) => {//callback hook  - after serving the request - forms & grid
         console.log('get callback', req.params.id);         
         if (req.params.id || req.query.id) {
            const model = require('mongoose').model(collection);
            let params = {
               id: req.params.id || req.query.id
            };
            model.getById(params, {
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
         return cb();//if error, return as first argument
      },
      callback: (serviceConfig, req, res, options, cb) => { //callback hook  for post request
         console.log('post callback');
         const model = require('mongoose').model(collection);
         
          let owner = JSON.parse(req.headers.owner);
          let obj = {
            createdBy : owner._id,
         };

         if (owner.role === 'CALL_CENTER_USER') {
               req.body.transferType = 'OutGoing';
         } else {
               req.body.transferType = 'InComing';
         }
       

         model.addOrEdit(req.body, null, (err, result) => {
              
         });

         if (req.query.currentstatus === 'PaymentPending') {
         //update trip to paymentMade if it is waiting at PaymentPending.
           const tripModel = require('mongoose').model('Trips');  
            let data = {};  
            let where = {
               _id : req.body.tripid,
               status : 'PaymentPending'
            };
            data._id = req.body.tripid;   
            data.where = where;
            data.status = 'PaymentMade';
            tripModel.editByWhere(data, null, cb);
        }
      }
   }
};
