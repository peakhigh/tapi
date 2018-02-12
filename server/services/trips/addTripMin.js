/* dont use imports, use require, because errors are coming when we are dynamically using services in the base model*/
let uiTypes = require('../../utils/ui-types');
const extend = require('extend');
// let ObjectID = require('mongodb').ObjectID;
// const model = require('../../models/trips'); -- wont work as this file is required on model creation
let authUtils = require('../../utils/auth');
const collection = 'Trips';
module.exports = {
   type: 'form',
   requestType: 'get',
   schemaFields: ['pickup.date', 'pickup.address.city', 'pickup.material.name',
             'pickup.material.materialType', 'pickup.material.weight', 'pickup.material.weightUnit', 'drop.date', 'drop.address.city',
                'vehicleRequirements.vehicleType', 'vehicleRequirements.vehicleCount', 'status'], // pick fields configuration from default schema
   schemaOverrideFeilds: {
      // 'pickup': {
      //    minItems: 1
      // },
      'pickup.date': {
         required: true
      },
      'pickup.address.city': {
         required: true
      },
      'pickup.material.weight': {
         required: true
      },
      'pickup.material.name': {
         required: true
      },
      'pickup.material.materialType': uiTypes.select(),
      'drop.date': {
         required: true
      },
      'drop.address.city': {
         required: true
      },
      'vehicleRequirements.vehicleType': uiTypes.select(),
   }, //override above listed schema fields         
   defaults: {
      status: 'New'
   },
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
         const usermodel = require('mongoose').model('Users');
         /** TODO: if date searches not working on pickupdate & dropdates, change them to dates instead of strings while saving */
        
         let owner = JSON.parse(req.headers.owner);
         if (owner !== null && owner.role !== 'CALL_CENTER_USER') {
            let obj = {
               createdBy : owner._id,
               /* 'updatedby' : req.headers.owner._id, */
            };
            extend(true, req.body, obj);
        } else {
           return cb('no owener info');
        }
        
        
        usermodel.getById({id:owner._id}, {}, (err, out) => {
            if (err) {
               console.log(err);
                  return cb('failed to add the trip');
            }
            let data = req.body;
            if (out && out.quote) {
               if (out.quote.defaultQuoteForPeriod === 'true' && out.quote.payAllLater === 'false') {
                     data.status = 'PaymentPending';
               } else if (out.quote.defaultQuoteForPeriod === 'true' && 
                           out.quote.payAllLater === 'true') {
                  data.status = 'Approved';
               }
            } 
             model.addOrEdit(data, null, cb);
         //   return cb('New trip has been created');
         });     
      }
   }
};
