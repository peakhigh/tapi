'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
var Cache = function Cache() {
   _classCallCheck(this, Cache);

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
};

exports.default = new Cache();
module.exports = exports['default'];
//# sourceMappingURL=cache.js.map
