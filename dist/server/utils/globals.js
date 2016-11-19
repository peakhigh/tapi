"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// let defineGlobal = (name, value, writable, configurable) => {
//     Object.defineProperty(exports.default, name, {
//         value: value,
//         enumerable: true,
//         writable: writable || false,
//         configurable: configurable || false
//     });
// };

var globals = {};
function defineGlobal(name, value, writable, configurable) {
    Object.defineProperty(globals, name, {
        value: value,
        enumerable: true,
        writable: writable || false,
        configurable: configurable || false
    });
}

// defineGlobal('TRIPS_TRUCKS', {
//    ROLES: {
//       ADMIN: {
//          Id: 1,
//          Code: 'ADMIN'
//       },
//       TRUCK_USER: {
//          Id: 2,
//          Code: 'TRUCK_USER'
//       },
//       TRUCK_OWNER: {
//          Id: 3,
//          Code: 'TRUCK_OWNER'
//       },
//       BROKER: {
//          Id: 4,
//          Code: 'BROKER'
//       },
//       CALL_CENTER_USER: {
//          Id: 5,
//          Code: 'CALL_CENTER_USER'
//       }
//    }   
// });

exports.default = { defineGlobal: defineGlobal, globals: globals };
module.exports = exports['default'];
//# sourceMappingURL=globals.js.map
