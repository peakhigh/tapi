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

// defineGlobal('APP_TOKENS', 'trips_trucks', true, true);

exports.default = { defineGlobal: defineGlobal, globals: globals };
module.exports = exports['default'];
//# sourceMappingURL=globals.js.map
