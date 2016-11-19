import globals from './globals';

export default { 
   cloneObject: function (source, destination) {
      for (let prop in source) {
         if (source.hasOwnProperty(prop)) {
            destination[prop] = source[prop];
         }
      }
      return destination;
   },
   setRoleDetails: function (key, value) {
      let obj = {};
      obj[key] = value;
      obj.setRoleDetails = function (k, v) {
         this[k] = v;
         return this;
      };
      return obj;
   },
   defineAppConfig: function (appName, appConfig) {
      console.log('.................', appName);
      globals.defineGlobal(appName, appConfig, true, true);
      console.log('.................', globals.TRIPS_TRUCKS);
   }
};