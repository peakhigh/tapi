import BaseSchemaFactory from './base';
import globals from '../utils/globals';
import utils from '../utils/util';

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
               roles: ['*'],
               role_config: {
               }
            }       
         }
      },
      mobileNumber: {
         type: String,
         required: true,
         match: [/^[1-9][0-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.'],
         config: {
            trips_trucks: {
               roles: utils.setObjectProperty('name', {key: 1}).setObjectProperty('age', 20)
               // roles: [globals.trips_trucks_ROLES.ADMIN.Code],
               // role_config: (() => {
               //    let config = {};
               //    config[globals.trips_trucks_ROLES.ADMIN.Code] = {
               //       title: 'Phone Number'
               //    };
               //    return config;    
               // })()
            } //app based roles
         }
      }
   }
}); 
export default TripsSchema.getSchema();