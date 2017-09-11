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
                     {title:'Requests!', icon: 'fa-envelope-open', page:'truckRequests'},
                     {title:'Payment Pendinng!', icon: 'fa-credit-card', page:'manageTruck'},
                     {title:'Payment Received!', icon: 'fa-credit-card', page:'manageTruck'},
                     {title:'Trucks!', icon: 'fa-truck', page:'manageTrucks'}
                     ]
               },
               {
                  title: 'Requests',
                  icon: 'fa-envelope-open',
                  page: 'truckRequests',
                  /* service: 'requests/service/addRequest', */            
               }, {
                  title: 'Trucks',
                  icon: 'fa-truck',
                  page: 'manageTrucks',      
                  service: 'trucks/service/manageTrucks',            
                  Menu: [{
                        title: 'New Truck',
                        icon: 'fa-plus',
                        page: 'addTruck',
                        service: 'trucks/service/addTruck'
                     }, {
                        title: 'Manage',
                        icon: 'fa-table',
                        page: 'manageTrucks',
                        service: 'trucks/service/manageTrucks'
                     }, 
                     {
                        title: 'Upload files',
                        icon: 'fa-table',
                        page: 'uploadDocs',
                        service: 'files/service/fileupload',
                        hide: true
                     }
                  ]
               },
                {
                  title: 'Drivers',
                  icon: 'fa-user-circle',
                  page: 'manageDrivers',                  
                  service: 'drivers/service/manageDrivers',
                  Menu: [{
                        title: 'New Driver',
                        icon: 'fa-plus',
                        page: 'addDriver',
                        service: 'drivers/service/addDriver'
                     }, {
                        title: 'Manage',
                        icon: 'fa-table',
                        page: 'manageDrivers',
                        service: 'drivers/service/manageDrivers'
                     },
                  ]
               },
               {
                  title: 'Payments',
                  icon: 'fa-credit-card',
                  page: 'payments',
             /*      service: 'trucks/service/truckRequests',    */         
               },
               {
                  title: 'Accounts',
                  icon: 'fa-bank',
                  page: 'manageBankAccounts',
                  service: 'accounts/service/manageBankAccounts',      
                  Menu: [{
                     title: 'New Account',
                     icon: 'fa-plus',
                     page: 'addBankAccount',
                     service: 'accounts/service/addBankAccount'
                  }, {
                     title: 'Manage',
                     icon: 'fa-table',
                     page: 'manageBankAccounts',
                     service: 'accounts/service/manageBankAccounts'
                  },
                 ]      
               },
               {
                  title: 'Update Profile',
                  icon: 'fa-pencil-square-o',
                  page: 'updateProfile',
                  service: 'users/service/updateProfile',
                  hide: true
               },
               {
                  title: 'Account Details',
                  icon: 'fa-user',
                  page: 'viewProfile',
                  service: 'users/service/updateProfile',
                  hide: true
               },
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
                     {title:'Payment Pendinng!', icon: 'fa-credit-card', page:'Paymentpending'}
                     ]
               }, {
                  title: 'Trips',
                  icon: 'fa-truck',
                  page: 'manageTrip',                  
                  service: 'trips/service/manageTrips',
                  Menu: [{
                        title: 'New Trip',
                        icon: 'fa-plus',
                        page: 'addTrip',
                        service: 'trips/service/addTrip',
                        hide: true
                     },
                     {
                        title: 'New Trip',
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
                  service: 'users/service/updateProfile',
                  Menu:[]
               },
               {
                  title: 'Account Details',
                  icon: 'fa-user',
                  page: 'viewProfile',
                  service: 'users/service/updateProfile',
                  Menu: []
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
                     {title:'Trips!', icon: 'fa-suitcase', page:'manageTrip'},
                     {title:'Trucks!', icon: 'fa-truck', page:'manageTrucks'},
                     {title:'Payments!', icon: 'fa-credit-card', page:'manageTrip'},
                     {title:'Users!', icon: 'fa-user', page:'manageUsers'}
                     ]
               },
               {
                  title: 'Trips',
                  icon: 'fa-table',
                  page: 'manageTrip',                  
                  service: 'trips/service/manageTrips',
                  Menu: [{
                     title: 'New Trip',
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
                  }
                  ]
               },               
               {
                  title: 'Trucks',
                  icon: 'fa-truck',
                  page: 'manageTrucks',      
                  service: 'trucks/service/manageTrucks',            
                  Menu: [{
                        title: 'New Truck',
                        icon: 'fa-plus',
                        page: 'addTruck',
                        service: 'trucks/service/addTruck'
                     }, {
                        title: 'Manage',
                        icon: 'fa-table',
                        page: 'manageTrucks',
                        service: 'trucks/service/manageTrucks'
                     }, 
                     {
                        title: 'Upload files',
                        icon: 'fa-table',
                        page: 'uploadDocs',
                        service: 'files/service/fileupload',
                        hide: true
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
                  icon: 'fa-user-circle',
                  page: 'manageDrivers',                  
                  service: 'drivers/service/manageDrivers',
                  Menu: [{
                        title: 'New Driver',
                        icon: 'fa-plus',
                        page: 'addDriver',
                        service: 'drivers/service/addDriver'
                     }, {
                        title: 'Manage',
                        icon: 'fa-table',
                        page: 'manageDrivers',
                        service: 'drivers/service/manageDrivers'
                     },
                  ]
               },
               {
                  title: 'Payments',
                  icon: 'fa-credit-card',
                  page: 'payments',
             /*      service: 'trucks/service/truckRequests',    */         
               },
                {
                  title: 'Users',
                  icon: 'fa-table',
                  page: 'manageUsers',                  
                  service: 'users/service/manageUser',
                  Menu: [{
                        title: 'New User',
                        icon: 'fa-table',
                        page: 'addUser',
                        service: 'users/service/addUser'
                     },
                     {
                        title: 'Manage',
                        icon: 'fa-table',
                        page: 'manageUsers',
                        service: 'users/service/manageUser'
                     }
                  ]
               },
               {
                  title: 'Update Profile',
                  icon: 'fa-pencil-square-o',
                  page: 'updateProfile',
                  service: 'users/service/updateProfile',
                  hide: true
               },
               {
                  title: 'Account Details',
                  icon: 'fa-user',
                  page: 'viewProfile',
                  service: 'users/service/updateProfile',
                  hide: true
               },
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