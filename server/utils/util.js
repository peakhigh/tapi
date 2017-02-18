/* dont use imports, use require, because errors are coming when we are dynamically using services in the base model*/
let globals = require('./globals');
let config = require('../../config/env');
//let rootDir = require('path').dirname(require.main.filename);
const fs = require('fs');
const path = require('path');
const extend = require('extend');

module.exports = {
   cloneObject: function (source, destination) {
      // for (let prop in source) {
      //    if (source.hasOwnProperty(prop)) {
      //       destination[prop] = source[prop];
      //    }
      // }
      // return destination;
      return extend(true, destination, source);
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
   },
   getServiceConfigs: function (collection) {
      let serviceConfigs = {};
      let servicesPath = path.resolve(`server/services/${collection.toLowerCase()}`);
      if (fs.existsSync(servicesPath)) {//prepare for computing services schema      
         // console.log('servicesPath', servicesPath);   
         let services = fs.readdirSync(servicesPath); // store service configs  
         services.forEach((serviceFileName) => {//for each schema
            // console.log('serviceFileName', serviceFileName);
            let serviceName = serviceFileName.replace('.js', '');
            let serviceConfig = require(`${servicesPath}/${serviceFileName}`);
            serviceConfigs[serviceName] = serviceConfig;
         });
      }
      // console.log('serviceConfigs', serviceConfigs);
      return serviceConfigs;
   },
   getSchemaTypeObject: function (obj, isArray, overrideObj) {
      /** TODO: overiride overrideObj propertes to obj nestedly */
      if (overrideObj && Object.keys(overrideObj).length > 0) {
         if (overrideObj.title) {
            obj.title = overrideObj.title;
         }
         if (overrideObj.type) {
            obj.type = overrideObj.type;
         }
      }
      return isArray ? [obj] : obj;
   }
};