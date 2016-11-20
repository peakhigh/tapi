import globals from './globals';
import config from '../../config/env';

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
      globals.defineGlobal(appName, appConfig, true, true);
   },
   getURLDetails: function (url) {
    let match = url.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
    return match && {
        protocol: match[1],
        host: match[2],
        hostname: match[3],
        port: match[4],
        pathname: match[5],
        search: match[6],
        hash: match[7]
    };
   },
   getRequestOrigin: function (url) {
      if (!url) {
         return '';
      }
      let startIndex = url.indexOf('://') + 3;
      let endIndex = url.indexOf(':', startIndex);
      if (endIndex < 0) {
         endIndex = url.indexOf('/', startIndex);
         if (endIndex < 0) {
            endIndex = url.length - 1;
         }
      }
      let retVal = url.trim().substring(startIndex, endIndex);
      if (retVal === 'localhost') {
         return config.defaultapp;
      }
      return retVal;
   }
};