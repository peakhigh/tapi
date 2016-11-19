import utils from '../utils/util';
utils.defineAppConfig('TRIPS_TRUCKS', {
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
});