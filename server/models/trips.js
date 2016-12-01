import BaseSchemaFactory from './base';
// import globals from '../utils/globals';
import utils from '../utils/util';
// import tripsTrucks from '../applicationsConfig/trips_trucks.js';
import cache from '../utils/cache';

// console.log(cache.TRIPS_TRUCKS);
const TripsSchema = new BaseSchemaFactory({ 
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

         },
         config: { //app based roles    
            trips_trucks: {
               roles: ['*']
            }       
         }
      },
      mobileNumber: {
         type: String,
         required: true,
         match: [/^[1-9][0-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.'],
         config: {
            trips_trucks: {               
               roles: utils.setRoleDetails(cache.TRIPS_TRUCKS.ROLES.ADMIN, {
                  title: 'Phone Number'
               }).setRoleDetails(cache.TRIPS_TRUCKS.ROLES.TRUCK_USER, {
                  title: 'Mobile'
               })
            } //app based roles
         }
      }
   }
}); 
// console.log(utils.setObjectProperty('name', {key: 1}).setObjectProperty('age', 20));
export default TripsSchema.getSchema();