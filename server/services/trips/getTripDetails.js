/* dont use imports, use require, because errors are coming when we are dynamically using services in the base model*/
let uiTypes = require('../../utils/ui-types');
// let ObjectID = require('mongodb').ObjectID;
// const model = require('../../models/trips'); -- wont work as this file is required on model creation
const collection = 'Trips';
module.exports = {
   type: 'form',
   requestType: 'get',
   schemaFields: ['pickup.date', 'pickup.address', 'pickup.contact', 'pickup.material', 'drop.date', 'drop.address', 'drop.contact', 'drop.itemsToDrop', 'vehicleRequirements', 'totalWeight', 'totalWeightUnit'], // pick fields configuration from default schema
   schemaOverrideFeilds: {
      // 'pickup': {
      //    minItems: 1
      // },
    
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
   }
};
