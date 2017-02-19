// import utils from '../../utils/util';

// let utils = require('../../utils/util'); 
let Schema = require('mongoose').Schema;
//schemaFields can be configured optionally, if configured, callback recieves formated form schmea as first argument
module.exports = {
   type: 'custom',
   // schemaFields: [], // optional
   get: {
      callback: (schema, serviceConfig, req, options, cb) => {
         console.log('get callback');
         cb(null, {test: 123});
      } //callback hook 
   }
};