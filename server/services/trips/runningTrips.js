let Schema = require('mongoose').Schema;
const collection = 'Trips';
module.exports = {
   type: 'grid',
   schemaFields: ['totalWeight', 'totalWeightUnit', 'pickup', 'drop', 'comments', 'vehicleRequirements', 'quotes', 'status'], // pick fields configuration from default schema
   get: {
       callback: (schema, serviceConfig, req, res, options, cb) => {//callback hook  - after serving the request - forms & grid
         console.log('get callback');
         const model = require('mongoose').model(collection);

         model.listFields({where: JSON.stringify({status: 'Running'})}, {
            selectFields: serviceConfig.schemaFields,
            response: {
               schema: schema
            }
         }, cb);
      }
   }
};