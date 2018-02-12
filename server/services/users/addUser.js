/* dont use imports, use require, because errors are coming when we are dynamically using services in the base model*/
let uiTypes = require('../../utils/ui-types');
let utils = require('../../utils/util');
let cache = require('../../utils/cache');

const collection = 'Users';
module.exports = {
   type: 'form',
   requestType: 'get',
   schemaFields: ['userName', 'firstName', 'lastName', 'gender', 'email', 'mobile', 'alternativePhone', 'organisationAddress', 'profile', 'security.password'], // pick fields configuration from default schema
   schemaOverrideFeilds: {
      
   }, //override above listed schema fields         
   prepare: (cacheKey, schema, serviceConfig) => { //on schema prepare - sync call
      //add any extra fields which are not in schema etc, default values etc
      //can do based on role, app etc by using the "cacheKey"
      //cacheKey format 'TRIPS_TRUCKS#ADMIN#USERS#SERVICE#addUser'
      schema.security.confirmPassword = {};
      utils.cloneObject(schema.security.password, schema.security.confirmPassword, false);
      schema.security.confirmPassword.title = 'Confirm Password';
      let cacheKeyDetails = utils.getCacheKeyDetails(cacheKey);
      if (cacheKeyDetails.role !== cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.CALL_CENTER_USER.Code) {
         delete schema.profile.handsetNumber; 
         delete schema.profile.customerOverrideNumber; 
      }
      switch (cacheKeyDetails.role) {
         case cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.CALL_CENTER_USER.Code:
            schema.profile.userType.form.dataSource = [{
                     value: cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.TRIP_ADMIN.Code,
                     text: 'Trip Admin'
                  }, {
                     value: cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.TRIP_USER.Code,
                     text: 'Trip User'
                  }, {
                     value: cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.TRUCK_ADMIN.Code,
                     text: 'Truck Admin'
                  }, {
                     value: cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.TRUCK_USER.Code,
                     text: 'Truck User'
                  }, {
                     value: cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.REPRESENTATIVE.Code,
                     text: 'Representative'
                  }, {
                     value: cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.DRIVER.Code,
                     text: 'Driver'
                  }, {
                     value: cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.CALL_CENTER_USER.Code,
                     text: 'Call Center User'
                  }
                  ];
              delete schema.profile.balance;   
            break;
         case cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.TRIP_ADMIN.Code:
             schema.profile.userType.form.dataSource = [{
                  value: cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.TRIP_USER.Code,
                  text: 'Trip User'
               }];                              
            break; 
         case cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.TRUCK_ADMIN.Code:
             schema.profile.userType.form.dataSource = [{
                  value: cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.TRUCK_USER.Code,
                  text: 'Truck User'
               }, {
                  value: cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.DRIVER.Code,
                  text: 'Driver'
               }];                
            break;         
         case cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.ADMIN.Code:
            delete schema.profile.balance;
            break;
         default:
            break;
      }
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
            delete schema.security;
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
         /** TODO: if date searches not working on pickupdate & dropdates, change them to dates instead of strings while saving */
         model.addOrEdit(req.body, null, cb);
      }
   }
};
