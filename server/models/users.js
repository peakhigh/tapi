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
      username: {
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
      contact: schemaUtils.contact(true),
      organisationAddress: schemaUtils.address(), 
      status: {
         type: String,
         enum: ['Active', 'Inactive'],
         default: 'Active'
      },
      profile: {
         userType: {
            type: String,
            html: {
               form: {
                  type: 'select',
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
            config: {
               TRIPS_TRUCKS: {
                  /*TODO roles based restrition
                     check role_config working or not
                  */
                  roles: [cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.ADMIN.Code, cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.CALL_CENTER_USER.Code, cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.TRUCK_ADMIN.Code, cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.TRIP_ADMIN.Code, cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.REPRESENTATIVE.Code],
                  roles_config: utils.setRoleDetails(cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.TRIP_ADMIN.Code, {
                        html: {
                           form: {
                              dataSource: [{
                                 value: cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.TRIP_ADMIN.Code,
                                 text: 'Trip Admin'
                              }, {
                                 value: cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.TRIP_USER.Code,
                                 text: 'Trip User'
                              }]
                           }
                        }
                     })
                     .setRoleDetails(cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.TRUCK_ADMIN.Code, {
                        html: {
                           form: {
                              dataSource: [{
                                 value: cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.TRUCK_ADMIN.Code,
                                 text: 'Truck Admin'
                              }, {
                                 value: cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.TRUCK_USER.Code,
                                 text: 'Truck User'
                              }]
                           }
                        }
                     })
                     .setRoleDetails(cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.REPRESENTATIVE.Code, {
                        html : {
                           form: {
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
                                 value: cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.DRIVER.Code,
                                 text: 'Driver'
                              }]
                           }
                        }
                     })
                     .setRoleDetails(cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.CALL_CENTER_USER.Code, {
                        html: {
                           form: {
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
                              }]
                        }
                     }
                  })                           
               } //app based roles
            }
         },
         balance: {
            type: Number,
            config: {
               TRIPS_TRUCKS: {
                  roles: [cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.TRUCK_ADMIN.Code, cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.TRUCK_USER.Code, cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.TRIP_ADMIN.Code, cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.TRIP_USER.Code, cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.REPRESENTATIVE.Code]
               }
            }
         },
         handsetNumber: {
            type: Number, 
            config: {
               TRIPS_TRUCKS: {
                  roles: [cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.CALL_CENTER_USER.Code]
               }
            }
         },
         customerOverrideNumber: {
            type: Number, 
            config: {
               TRIPS_TRUCKS: {
                  roles: [cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.CALL_CENTER_USER.Code]
               }
            }
         }
      },
      services: {
         password: {
            type: String,
            required: true
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
   gridAttributes: ['title']
}); 
module.exports = CurrentSchema.getSchema();