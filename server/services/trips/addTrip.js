let Schema = require('mongoose').Schema;
module.exports = {
   type: 'form',
   schemaFields: ['totalWeight', 'pickup', 'drop', 'comments', 'vehicleRequirements'], // pick fields configuration from default schema
   schemaOverrideFeilds: {}, //override above listed schema fields         
   defaults: {
      status : 'new'
   },
   prepare: (schema) => {}, //on schema prepare
   init: () => {}, //on init hook
   pre: () => {}, //pre submit hook  
   post: () => {} //post submit hook  
};