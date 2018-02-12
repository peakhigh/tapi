let Schema = require('mongoose').Schema;
let cache = require('../../utils/cache');
const extend = require('extend');
let schemaFilters = require('../../utils/schema-filters');
const collection = 'Trips';
module.exports = {
   type: 'grid',
   roles: [cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.ADMIN.Code,
       cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.CALL_CENTER_USER.Code,
      cache.APP_CONFIG.TRIPS_TRUCKS.ROLES.TRIP_ADMIN.Code], //role based security for services
   schemaFields: ['totalWeight', 'totalWeightUnit', 'pickup', 'drop', 'comments', 
   'vehicleRequirements', 'quotes', 'status'], // pick fields configuration from default schema   
   defaultFilterFields: schemaFilters.getTripDefaultFilters(), //common place
   filterFields: ['pickup.date', 'drop.date', 'status'],   
   get: {
       callback: (schema, serviceConfig, req, res, options, cb) => {//callback hook  - after serving the request - forms & grid
         console.log('get callback');
         const model = require('mongoose').model(collection);

         let where = {};
         if (!req.query.querystr) {
            if (req.query.query) {
               where = req.query.query; 
            } else {
               where = {status: req.query.status};
            }
         }
            
         let owner = JSON.parse(req.headers.owner);
         if (owner !== null && owner.role !== 'CALL_CENTER_USER') {
            let obj = {
               createdBy : owner._id,
               /* 'updatedby' : req.headers.owner._id, */
            };
            extend(true, where, obj);
        }

        req.query.where = JSON.stringify(where);

         model.listFields(req.query, {
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