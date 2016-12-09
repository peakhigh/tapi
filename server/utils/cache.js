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
            Code: 'TRUCK_USER'
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
            Code: 'CALL_CENTER_USER'
         }
      }      
   };   
  }
  updateSchemaStore(roleBasedSchemas) {     
     if (!this.SCHEMA_STORE) { //schema store contains all the schemas per html(form, grid) per db per role per app per collection like a key value 
        this.SCHEMA_STORE = {};
     }
     //key strucrure
     //for form => appKey + sep + role.Code + sep + collection_name + sep + CONFIG_KEY_FORM_SUFFIX
     //for grid => appKey + sep + role.Code + sep + collection_name + sep + CONFIG_KEY_GRID_SUFFIX
     //for db => appKey + sep + role.Code + sep + collection_name + sep + CONFIG_KEY_DB_SUFFIX
     utils.cloneObject(roleBasedSchemas, this.SCHEMA_STORE);
  }
}

export default (new Cache);