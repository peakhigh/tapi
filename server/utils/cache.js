// let instance = null;
// class Cache {
//   constructor() {
//     if (!instance) { instance = this; }
//     this.time = new Date();

//     return instance;
//   }
// }

// export default { instance }

//TODO:: use singleton class and load all appconfigs only once
//TODO:: load app configs from the applicationConfig directory 
//automate it in the constructor
const utils = require('./util');
const authUtils = require('./auth');
const constants = require('../config/constants');
const schemaUtils = require('./schema');
const extend = require('extend');

class Cache {
  constructor() {
    //TODO:: everything should be json files from applicationConfig directory
    this.APP_CONFIG = {};
    this.APP_CONFIG.TRIPS_TRUCKS = {
      ROLES: {
         ADMIN: {
            Id: 1,
            Code: 'ADMIN'
         },
         TRUCK_USER: {
            Id: 2,
            Code: 'TRUCK_USER',
            Menu: {
               SideMenu: [{
                  title: 'Dashboard',
                  icon: 'fa-dashboard',
                  page: 'dashboard'
               }, {
                  title: 'Trips',
                  icon: 'fa-table',
                  page: 'manageTrip',
                  Menu: [{
                        title: 'Add New',
                        icon: 'fa-table',
                        page: 'addTrip'
                     }, {
                        title: 'Manage',
                        icon: 'fa-table',
                        page: 'manageTrip'
                     }
                  ]
               }]
            }
         },
         TRUCK_OWNER: {
            Id: 3,
            Code: 'TRUCK_OWNER'
         },
         BROKER: {
            Id: 4,
            Code: 'BROKER'
         },
         CALL_CENTER_USER: {
            Id: 5,
            Code: 'CALL_CENTER_USER',
            Menu: {
               SideMenu: [{
                  title: 'Dashboard',
                  icon: 'fa-dashboard',
                  page: 'home'
               }, {
                  title: 'Trucks',
                  icon: 'fa-table',
                  page: 'manageTruck',                  
                  Menu: [{
                        title: 'Add New',
                        icon: 'fa-table',
                        page: 'addTruck'
                     }, {
                        title: 'Manage',
                        icon: 'fa-table',
                        page: 'manageTruck'
                     }
                  ]
               }, {
                  title: 'Trips',
                  icon: 'fa-table',
                  page: 'manageTrip',                  
                  service: 'trips/service/manageTrip',
                  Menu: [{
                        title: 'Add New',
                        icon: 'fa-table',
                        page: 'addTrip',
                        service: 'trips/service/addTrip'
                     }, {
                        title: 'Manage',
                        icon: 'fa-table',
                        page: 'manageTrip',
                        service: 'trips/service/manageTrip'
                     }, {
                        title: 'Set Quote',
                        icon: 'fa-table',
                        page: 'setQuote',
                        service: 'trips/service/setQuote',
                        hide: true
                     }, 
                     {
                        title: 'Add Comments',
                        icon: 'fa-table',
                        page: 'addComments',
                        service: 'trips/service/addComments',
                        hide: true
                     }
                  ]
               }, {
                  title: 'Drivers',
                  icon: 'fa-table',
                  page: 'manageDriver',                  
                  service: 'drivers/service/manageDriver',
                  Menu: [{
                        title: 'Add New',
                        icon: 'fa-table',
                        page: 'addDriver',
                        service: 'drivers/service/addDriver'
                     }, {
                        title: 'Manage',
                        icon: 'fa-table',
                        page: 'manageDriver',
                        service: 'drivers/service/manageDriver'
                     },
                  ]
               }
               ]
            }
         }
      }      
   };   
  }
  updateSchemaStore(schemas) {     
     if (!this.SCHEMA_STORE) { //schema store contains all the schemas per html(form, grid) per db per role per app per collection like a key value 
        this.SCHEMA_STORE = {};
     }
     //key structure
     //for form => appKey + sep + role.Code + sep + collection_name + sep + CONFIG_KEY_FORM_SUFFIX
     //for grid => appKey + sep + role.Code + sep + collection_name + sep + CONFIG_KEY_GRID_SUFFIX
     //for db => appKey + sep + role.Code + sep + collection_name + sep + CONFIG_KEY_DB_SUFFIX

     Object.keys(schemas).forEach((key) => {//this is designed to work for alpaca plugin
        if (key.indexOf(constants.CONFIG_KEY_SEPERATOR + constants.CONFIG_KEY_FORM_SUFFIX.toUpperCase()) > 0) {
           schemas[key] = schemaUtils.formatHtmlSchema(schemas[key]);
        }
     });
     utils.cloneObject(schemas, this.SCHEMA_STORE);
  }
  updateServiceSchemaStore(schemas, serviceConfigs) {     
     if (!this.SCHEMA_STORE) { //schema store contains all the schemas per html(form, grid) per db per role per app per collection like a key value 
        this.SCHEMA_STORE = {};
     }
     //key structure   
     //for services => appKey#role.Code#collection_name#serviceType#addTrip'    
     Object.keys(schemas).forEach((key) => {//this is designed to work for alpaca plugin
        let keyParts = key.split(constants.CONFIG_KEY_SEPERATOR);
        if (serviceConfigs[keyParts[keyParts.length - 1]] && serviceConfigs[keyParts[keyParts.length - 1]].type === 'form') {
           schemas[key] = schemaUtils.formatHtmlSchema(schemas[key]);
        }       
     });
     utils.cloneObject(schemas, this.SCHEMA_STORE);
  }


  getRequestSchema(req) {
      let key = this.getKey(req);
      return key ? extend(true, {}, this.SCHEMA_STORE[key]) : {};
  }
  getRequestServiceSchema(req) {
      let key = this.getServiceKey(req);
      return key ? extend(true, {}, this.SCHEMA_STORE[key]) : {};
  }
  getKey(req) {
     let tokenDetails = authUtils.decodeToken(req.headers);
     if (tokenDetails) {
        let urlParts = req.originalUrl.replace('/', '').split('?')[0].split('#')[0].split('/');
        //app + role + collection + key_type(form/grid/db)
        return (tokenDetails.app + constants.CONFIG_KEY_SEPERATOR + tokenDetails.role + constants.CONFIG_KEY_SEPERATOR + urlParts[1] + constants.CONFIG_KEY_SEPERATOR + urlParts[2]).toUpperCase();
     }
  }
  getServiceKey(req) {
     let tokenDetails = authUtils.decodeToken(req.headers);
     if (tokenDetails) {
        let urlParts = req.originalUrl.replace('/', '').split('?')[0].split('#')[0].split('/');
        //app + role + collection + service_type (form/grid/db) + servicename(uppercase)
        //console.log((tokenDetails.app + constants.CONFIG_KEY_SEPERATOR + tokenDetails.role + constants.CONFIG_KEY_SEPERATOR + urlParts[1] + constants.CONFIG_KEY_SEPERATOR + constants.CONFIG_KEY_SERVICE_SUFFIX + constants.CONFIG_KEY_SEPERATOR).toUpperCase() + urlParts[3]);
        return (tokenDetails.app + constants.CONFIG_KEY_SEPERATOR + tokenDetails.role + constants.CONFIG_KEY_SEPERATOR + urlParts[1] + constants.CONFIG_KEY_SEPERATOR + constants.CONFIG_KEY_SERVICE_SUFFIX + constants.CONFIG_KEY_SEPERATOR).toUpperCase() + urlParts[3];
     }
  }
}

module.exports = (new Cache);