let Schema = require('mongoose').Schema;
let cache = require('../../utils/cache');
let schemaFilters = require('../../utils/schema-filters');
const collection = 'Trips';
module.exports = {
   type: 'grid',
   roles: [cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.ADMIN.Code, cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.CALL_CENTER_USER.Code,
      cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.TRIP_ADMIN.Code], //role based security for services
   schemaFields: ['totalWeight', 'totalWeightUnit', 'pickup', 'drop', 'comments', 'vehicleRequirements', 'quotes', 'status'], // pick fields configuration from default schema   
   defaultFilterFields: schemaFilters.getTripDefaultFilters(), //common place
   filterFields: ['pickup.date', 'drop.date', 'status'],   
   get: {
       callback: (schema, serviceConfig, req, res, options, cb) => {//callback hook  - after serving the request - forms & grid
         console.log('get callback');
         const model = require('mongoose').model(collection);
         console.log(req.query);
         model.listFields({where: JSON.stringify({status: 'Paymentpending'})}, {
            queryFields: serviceConfig.defaultFilterFields,
            queryType: 'or',
            selectFields: serviceConfig.schemaFields,
            response: {
               schema: schema
            }
         }, cb);
      }
   }
};