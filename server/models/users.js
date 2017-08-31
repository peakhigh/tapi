let BaseSchemaFactory = require('./base');
const utils = require('../utils/util');
let cache = require('../utils/cache');
const schemaUtils = require('../utils/schema');
const schemaTypeUtils = require('../utils/schema-types');
const uiTypes = require('../utils/ui-types');

let Schema = require('mongoose').Schema;

const CurrentSchema = new BaseSchemaFactory({ 
   collection: 'Users',   
   schema: {
      userName: {
         type: String,
         required: true          
      },
      firstName: {
         type: String,
         required: true
      },
      lastName: {
         type: String,
         required: true
      },
      gender: {
         type: String,
         required: true,
         enum: ['Male', 'Female'],
         default: 'Male'
      },
      profilePic: {
            type: String
      },
      email: schemaTypeUtils.email(false, {required: true}), 
      mobile: schemaTypeUtils.mobile(false, {required: true}),
      alternativePhone: schemaTypeUtils.mobile(),
      organisationAddress: schemaUtils.addressRequired(),      
      status: {
         type: String,
         enum: ['Active', 'Inactive'],
         default: 'Active',
         required: true
      },
      profile: {
         userType: {
            type: String,
            required: true,
            html: {
               form: {
                  type: 'select',
                  noneLabel: '-- Select --',
                  removeDefaultNone: false,
                  dataSource: [{
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
                  }, {
                     value: cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.ADMIN.Code,
                     text: 'Admin'
                  }]
               }
            },            
         },
         balance: {
            type: Number
         },
         handsetNumber: {
            type: Number
         },
         customerOverrideNumber: {
            type: Number
         }
      },
      security: {
         password: {
            type: String,
            required: true,
            html: {
               format: 'password'
            }
         },
         lastLoginTokens: {
            type: [String]
         }
      }          
   },
   dontExpose: {
     manageFields: ['services'],
     formFields: ['createdBy', 'updatedBy', 'services.lastLoginTokens', 'status'] 
   },
   gridAttributes: ['title'],
   hooks: {
      form: {
          prepare: (cacheKey, schema, collectionConfig) => {
            //add any extra fields which are not in schema etc, default values etc
            //can do based on role, app etc by using the "cacheKey"
            //cacheKey format 'TRIPS_TRUCKS#ADMIN#USERS#SERVICE#addUser'
            // console.log(cacheKey);
          }
      },
      grid: {
         prepare: (cacheKey, schema, collectionConfig) => {
            //add any extra fields which are not in schema etc, default values etc
            //can do based on role, app etc by using the "cacheKey"
            //cacheKey format 'TRIPS_TRUCKS#ADMIN#USERS#SERVICE#addUser'
            // console.log(cacheKey);
         }
      },
      db: {
         prepare: (cacheKey, schema, collectionConfig) => {
            //add any extra fields which are not in schema etc, default values etc
            //can do based on role, app etc by using the "cacheKey"
            //cacheKey format 'TRIPS_TRUCKS#ADMIN#USERS#SERVICE#addUser'
            // console.log(cacheKey);
         }
      }
   }
}); 
module.exports = CurrentSchema.getSchema();