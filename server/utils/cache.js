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
import utils from './util';
import authUtils from './auth';
import constants from '../config/constants';

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
                  page: 'managetrips',
                  Menu: [{
                        title: 'Add New',
                        icon: 'fa-table',
                        page: 'newtrips'
                     }, {
                        title: 'Manage',
                        icon: 'fa-table',
                        page: 'managetrips'
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
                  page: 'dashboard'
               }, {
                  title: 'Trucks',
                  icon: 'fa-table',
                  page: 'managetrucks',
                  Menu: [{
                        title: 'Add New',
                        icon: 'fa-table',
                        page: 'newtrucks'
                     }, {
                        title: 'Manage',
                        icon: 'fa-table',
                        page: 'managetrucks'
                     }
                  ]
               }, {
                  title: 'Trips',
                  icon: 'fa-table',
                  page: 'managetrips',
                  Menu: [{
                        title: 'Add New',
                        icon: 'fa-table',
                        page: 'newtrips'
                     }, {
                        title: 'Manage',
                        icon: 'fa-table',
                        page: 'managetrips'
                     }
                  ]
               }]
            }
         }
      }      
   };   
  }
  updateSchemaStore(roleBasedSchemas) {     
     if (!this.SCHEMA_STORE) { //schema store contains all the schemas per html(form, grid) per db per role per app per collection like a key value 
        this.SCHEMA_STORE = {};
     }
     //key structure
     //for form => appKey + sep + role.Code + sep + collection_name + sep + CONFIG_KEY_FORM_SUFFIX
     //for grid => appKey + sep + role.Code + sep + collection_name + sep + CONFIG_KEY_GRID_SUFFIX
     //for db => appKey + sep + role.Code + sep + collection_name + sep + CONFIG_KEY_DB_SUFFIX
     utils.cloneObject(roleBasedSchemas, this.SCHEMA_STORE);
  }
  getRequestSchema(req) {
      let key = this.getKey(req);
      return key ? this.SCHEMA_STORE[key] : {};
  }
  getKey(req) {
     let tokenDetails = authUtils.decodeToken(req.headers);
     if (tokenDetails) {
        let urlParts = req.originalUrl.replace('/', '').split('?')[0].split('#')[0].split('/');
        //app + role + collection + key_type(form/grid/db)
        return (tokenDetails.app + constants.CONFIG_KEY_SEPERATOR + tokenDetails.role + constants.CONFIG_KEY_SEPERATOR + urlParts[1] + constants.CONFIG_KEY_SEPERATOR + urlParts[2]).toUpperCase();
     }
  }
}

export default (new Cache);