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
class Cache {
  constructor() {
    // everything should be json files from applicationConfig directory
    this.TRIPS_TRUCKS = {
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
}

export default (new Cache);