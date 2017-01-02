import BaseSchemaFactory from './base';
// import globals from '../utils/globals';
import utils from '../utils/util';
// import tripsTrucks from '../applicationsConfig/trips_trucks.js';
import cache from '../utils/cache';

// console.log(cache.TRIPS_TRUCKS);
const CurrentSchema = new BaseSchemaFactory({ 
   collection: 'Trips',   
   schema: {
      /*
      define common, html-only, db-only properties
      grid-only columns - role based
      */
      /*
      role based permissions
      owner columns
      date columns
      link columns
       */
      username: {
         type: String,
         required: true,         
         html: {

         },       
         db: {

         }
      },
      mobileNumber: {
         type: String,
         required: true,
         match: [/^[1-9][0-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.'],
         config: {//if config, it is considered same for all roles
            trips_trucks: {               
               html: {//if html specific not mentioned, it is considered same for all roles
                  roles: ['*'],
                  roles_config: utils.setRoleDetails(cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.ADMIN.Code, {
                     title: 'Phone Number'
                  }).setRoleDetails(cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.TRUCK_USER.Code, {
                     title: 'Mobile'
                  })
               },
               db: {//if db specific not mentioned, it is considered same for all roles
                  roles: ['*']
               }             
            } //app based roles
         }
      }
   },
   gridAttributes: ['title']
}); 
// console.log(utils.setObjectProperty('name', {key: 1}).setObjectProperty('age', 20));
export default CurrentSchema.getSchema();