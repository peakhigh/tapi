// let defineGlobal = (name, value, writable, configurable) => {
//     Object.defineProperty(exports.default, name, {
//         value: value,
//         enumerable: true,
//         writable: writable || false,
//         configurable: configurable || false
//     });
// };

let globals = {};
function defineGlobal(name, value, writable, configurable) {
    Object.defineProperty(globals, name, {
        value: value,
        enumerable: true,
        writable: writable || false,
        configurable: configurable || false
    });
}

// defineGlobal('APP_TOKENS', 'trips_trucks', true, true);

export default { defineGlobal, globals };