let Schema = require('mongoose').Schema;
//schemaFields can be configured optionally, if configured, callback recieves formated form schmea as first argument
module.exports = {
   type: 'custom',
   // schemaFields: [], // optional
   callback: (schema, serviceConfig, req) => {
      return {test: 123};
   } //callback hook 
};