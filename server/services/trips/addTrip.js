module.exports = {
   type: 'form',
   requestType: 'get',
   schemaFields: ['totalWeight', 'pickup', 'drop', 'comments', 'vehicleRequirements'], // pick fields configuration from default schema
   schemaOverrideFeilds: {}, //override above listed schema fields         
   defaults: {
      status : 'new'
   },
   prepare: (cacheKey, schema, serviceConfig) => { //on schema prepare
      //add any extra fields which are not in schema etc, default values etc
      //can do based on role, app etc by using the "cacheKey"
      //cacheKey format 'TRIPS_TRUCKS#ADMIN#TRIPS#FORM#ADDTRIP'

      // console.log(cacheKey); 
      // console.log(schema); 
   }, 
   init: (serviceConfig, req) => {}, //on init hook, will get executed on service request - init
   // pre: () => {}, //pre submit hook  - before serving the request - only for forms
   callback: (schema, serviceConfig, req) => {return schema;} //callback hook  - after serving the request - forms & grid
};