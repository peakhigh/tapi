let Schema = require('mongoose').Schema;
let cache = require('../../utils/cache');
const extend = require('extend');
let schemaFilters = require('../../utils/schema-filters');
let uiTypes = require('../../utils/ui-types');
const collection = 'Trips';
module.exports = {
   type: 'form',
   requestType: 'get',
   schemaFields: ['pickup.date', 'pickup.address.city', 'pickup.material.name',
             'pickup.material.materialType', 'pickup.material.weight', 'pickup.material.weightUnit', 'drop.date', 'drop.address.city',
                'vehicleRequirements.vehicleType', 'vehicleRequirements.vehicleCount'], // pick fields configuration from default schema
   schemaOverrideFeilds: {
      // 'pickup': {
      //    minItems: 1
      // },
      'pickup.date': {
         required: true
      },
      'pickup.address.city': {
         required: true
      },
      'pickup.material.weight': {
         required: true
      },
      'pickup.material.name': {
         required: true
      },
      'pickup.material.materialType': uiTypes.select(),
      'drop.date': {
         required: true
      },
      'drop.address.city': {
         required: true
      },
      'vehicleRequirements.vehicleType': uiTypes.select(),
   }, //override above listed schema fields         
   defaults: {
      status: 'New'
   },  
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
            selectFields: serviceConfig.schemaFields,
            response: {
               schema: schema
            }
         }, cb);
      }
   }
};