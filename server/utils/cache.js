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
         TRUCK_ADMIN: {
            Id: 2,
            Code: 'TRUCK_ADMIN',
             Menu: {
               SideMenu: [{
                  title: 'Dashboard',
                  icon: 'fa-dashboard',
                  page: 'home',
                   options: [
                     {title:'Messages!', icon: 'fa-envelope', page:''},
                     {title:'Manage Trucks!', icon: 'fa-truck', page:'manageTruck'},
                     {title:'Requests!', icon: 'fa-suitcase', page:'manageTruck'},
                     {title:'Notifications!', icon: 'fa-ticket', page:''}
                     ]
               }, {
                  title: 'Trucks',
                  icon: 'fa-table',
                  page: 'manageTruck',      
                  service: 'trucks/service/manageTruck',            
                  Menu: [{
                        title: 'Add New',
                        icon: 'fa-table',
                        page: 'addTruck',
                        service: 'trucks/service/addTruck'
                     }, {
                        title: 'Manage',
                        icon: 'fa-table',
                        page: 'manageTruck',
                        service: 'trucks/service/manageTruck'
                     }, {
                        title: 'Running',
                        icon: 'fa-table',
                        page: 'runningTrucks',
                        service: 'trucks/service/runningTrucks'
                     },
                      {
                        title: 'Set Driver',
                        icon: 'fa-table',
                        page: 'setDriver',
                        service: 'trucks/service/setDriver',
                        hide: true
                     }, 
                     {
                        title: 'Search trips',
                        icon: 'fa-table',
                        page: 'searchTrips',
                        service: 'trips/service/pendingTrips'
                     }, 
                      {
                        title: 'Set Quote',
                        icon: 'fa-table',
                        page: 'setQuote',
                        service: 'requests/service/setQuote',
                        hide: true
                     }
                  ]
               },
                {
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
         },
         TRUCK_USER: {
            Id: 3,
            Code: 'TRUCK_USER'
         },
         TRIP_ADMIN: {
            Id: 4,
            Code: 'TRIP_ADMIN',
             Menu: {
               SideMenu: [{
                  title: 'Dashboard',
                  icon: 'fa-dashboard',
                  page: 'home',
                   options: [
                     {title:'Quotes!', icon: 'fa-suitcase', page:'Quoted'},
                     {title:'Running!', icon: 'fa-truck', page:'Running'},
                     {title:'Assigned!', icon: 'fa-truck', page:'Assigned'},
                     {title:'Payment Pending!', icon: 'fa-credit-card', page:'Paymentpending'}
                     ]
               }, {
                  title: 'Trips',
                  icon: 'fa-truck',
                  page: 'manageTrip',                  
                  service: 'trips/service/manageTrips',
                  Menu: [{
                        title: 'Add Trip',
                        icon: 'fa-plus',
                        page: 'addTrip',
                        service: 'trips/service/addTrip',
                        hide: true
                     },
                     {
                        title: 'Add Trip',
                        icon: 'fa-plus',
                        page: 'addTripMin',
                        service: 'trips/service/addTripMin',
                     },
                      {
                        title: 'Manage Trips',
                        icon: 'fa-list-ol',
                        page: 'manageTrip',
                        service: 'trips/service/manageTrips'
                     },
                     {
                        title: 'CancelTrip',
                        icon: 'fa-table',
                        page: 'cancelTrip',
                        service: 'trips/service/cancelTrip',
                        hide: true
                     }, 
                      {
                        title: 'Set Status',
                        icon: 'fa-table',
                        page: 'setStatus',
                        service: 'trips/service/setStatus',
                        hide: true
                     }, 
                     {
                        title: 'Upload files',
                        icon: 'fa-table',
                        page: 'uploadDocs',
                        service: 'files/service/fileupload',
                        hide: true
                     },
                     {
                        title: 'Comments',
                        icon: 'fa-table',
                        page: 'addComments',
                        service: 'trips/service/addComments',
                        hide: true
                     },
                     {
                        title: 'Trip Details',
                        icon: 'fa-table',
                        page: 'viewTripDetails',
                        service: 'trips/service/getTripDetails',
                        hide: true
                     },
                     {
                        title: 'Payment',
                        icon: 'fa-table',
                        page: 'tripPayment',
                        service: 'trips/service/tripPayment',
                        hide: true
                     }
                  ]
               },
               {
                  title: 'Update Profile',
                  icon: 'fa-pencil-square-o',
                  page: 'updateProfile',
                  service: 'users/service/updateProfile'
               },
               {
                  title: 'Account Details',
                  icon: 'fa-user',
                  page: 'viewProfile',
                  service: 'users/service/updateProfile'
               },

               ]
             }
         },
         TRIP_USER: {
            Id: 5,
            Code: 'TRIP_USER',
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
               },

               ]
            }
         },         
         REPRESENTATIVE: {
            Id: 6,
            Code: 'REPRESENTATIVE'
         },
         DRIVER: {
            Id: 7,
            Code: 'DRIVER'
         },
         CALL_CENTER_USER: {
            Id: 8,
            Code: 'CALL_CENTER_USER',
            Menu: {
               SideMenu: [{
                  title: 'Dashboard',
                  icon: 'fa-dashboard',
                  page: 'home',
                  options: [
                     {title:'Messages!', icon: 'fa-envelope', page:''},
                     {title:'New Trucks!', icon: 'fa-truck', page:'manageTruck'},
                     {title:'New Trips!', icon: 'fa-suitcase', page:'manageTrip'},
                     {title:'Support Tickets!', icon: 'fa-ticket', page:''}
                     ]
               }, {
                  title: 'Trucks',
                  icon: 'fa-table',
                  page: 'manageTruck',      
                  service: 'trucks/service/manageTruck',            
                  Menu: [{
                        title: 'Add New',
                        icon: 'fa-table',
                        page: 'addTruck',
                        service: 'trucks/service/addTruck'
                     }, {
                        title: 'Manage',
                        icon: 'fa-table',
                        page: 'manageTruck',
                        service: 'trucks/service/manageTruck'
                     },
                     {
                        title: 'Running',
                        icon: 'fa-table',
                        page: 'runningTrucks',
                        service: 'trucks/service/runningTrucks'
                     },
                      {
                        title: 'Set Driver',
                        icon: 'fa-table',
                        page: 'setDriver',
                        service: 'trucks/service/setDriver',
                        hide: true
                     }, 
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
                     }, 
                      {
                        title: 'Running',
                        icon: 'fa-table',
                        page: 'runningTrips',
                        service: 'trips/service/runningTrips'
                     }, {
                        title: 'Pending',
                        icon: 'fa-table',
                        page: 'pendingTrips',
                        service: 'trips/service/pendingTrips'
                     },
                     {
                        title: 'Set Status',
                        icon: 'fa-table',
                        page: 'setStatus',
                        service: 'trips/service/setStatus',
                        hide: true
                     }, 
                     {
                        title: 'Upload file',
                        icon: 'fa-table',
                        page: 'uploadfiles',
                        service: 'files/service/fileupload',
                        hide: true
                     },
                     {
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
                  title: 'Users',
                  icon: 'fa-table',
                  page: 'manageUsers',                  
                  service: 'users/grid',
                  Menu: [{
                        title: 'Add User',
                        icon: 'fa-table',
                        page: 'addUser',
                        service: 'users/service/addUser'
                     }, {
                        title: 'Update Profile',
                        icon: 'fa-table',
                        page: 'updateProfile',
                        service: 'users/service/updateProfile'
                     }, {
                        title: 'Manage',
                        icon: 'fa-table',
                        page: 'manageUsers',
                        service: 'users/service/manageUser'
                     }
                  ]
               } 

               // {
               //    title: 'Drivers',
               //    icon: 'fa-table',
               //    page: 'manageDriver',                  
               //    service: 'drivers/service/manageDriver',
               //    Menu: [{
               //          title: 'Add New',
               //          icon: 'fa-table',
               //          page: 'addDriver',
               //          service: 'drivers/service/addDriver'
               //       }, {
               //          title: 'Manage',
               //          icon: 'fa-table',
               //          page: 'manageDriver',
               //          service: 'drivers/service/manageDriver'
               //       },
               //    ]
               // }
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

   //   Object.keys(schemas).forEach((key) => {//this is designed to work for alpaca plugin
   //      if (key.indexOf(constants.CONFIG_KEY_SEPERATOR + constants.CONFIG_KEY_FORM_SUFFIX.toUpperCase()) > 0) {
   //         schemas[key] = schemaUtils.formatHtmlSchema(schemas[key]);
   //      }
   //   });
     utils.cloneObject(schemas, this.SCHEMA_STORE);
  }
  updateServiceSchemaStore(schemas, serviceConfigs) {     
     if (!this.SCHEMA_STORE) { //schema store contains all the schemas per html(form, grid) per db per role per app per collection like a key value 
        this.SCHEMA_STORE = {};
     }
     //key structure   
     //for services => appKey#role.Code#collection_name#serviceType#addTrip'    
   //   Object.keys(schemas).forEach((key) => {//this is designed to work for alpaca plugin
   //      let keyParts = key.split(constants.CONFIG_KEY_SEPERATOR);
   //      if (serviceConfigs[keyParts[keyParts.length - 1]] && serviceConfigs[keyParts[keyParts.length - 1]].type === 'form') {
   //         schemas[key] = schemaUtils.formatHtmlSchema(schemas[key]);
   //      }       
   //   });
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