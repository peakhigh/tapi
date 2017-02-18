/* dont use imports, use require, because errors are coming when we are dynamically using services in the base model*/

let uiTypes = require('../../utils/ui-types');
module.exports = {
   type: 'form',
   requestType: 'get',
   allowPostData: true,
   schemaFields: ['pickup.date', 'pickup.address', 'pickup.contact', 'pickup.material', 'drop.date', 'drop.address', 'drop.contact', 'drop.itemsToDrop', 'vehicleRequirements', 'comments', 'totalWeight'], // pick fields configuration from default schema
   schemaOverrideFeilds: {
      // 'pickup': {
      //    minItems: 1
      // },
      'pickup.date' : {
         required: true         
      },
      'pickup.address.street': {
         required: true
      },
      'pickup.address.city': {
         required: true
      },
      'pickup.address.state': {
         required: true
      },
      'pickup.address.zip': {
         required: true
      },
      'pickup.address.country': {
         required: true
      },
      'pickup.contact.mobile': {
         required: true
      },    
      'pickup.material.name': {
         required: true
      },  
      'pickup.material.materialType': uiTypes.select(),
      'drop.date' : {
         required: true
      },
      'drop.address.street': {
         required: true
      },
      'drop.address.city': {
         required: true
      },
      'drop.address.state': {
         required: true
      },
      'drop.address.zip': {
         required: true
      },
      'drop.address.country': {
         required: true
      },
      'drop.contact.mobile': {
         required: true
      },
      'vehicleRequirements.vechicleType': uiTypes.select(),
      totalWeight: {
         required: true
      }
   }, //override above listed schema fields         
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
   callback: (schema, serviceConfig, req) => {return schema;}, //callback hook  - after serving the request - forms & grid
   postValidate: (serviceConfig, req) => {}, //on postValidate, will get executed on POST service request
   postCallback: (schema, serviceConfig, req) => { 
      console.log('....', typeof req.body, req.body); 
      return {success: true};
   }//callback hook  for post request
};