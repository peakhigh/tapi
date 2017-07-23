let Schema = require('mongoose').Schema;
const collection = 'Trips';
module.exports = {
   type: 'grid',
   schemaFields: ['totalWeight', 'totalWeightUnit', 'pickup', 'drop', 'comments', 'vehicleRequirements', 'quotes', 'status'], // pick fields configuration from default schema   
   defaultFilterFields: {
      'status': { op: '^' }, 
      'currentPoint': { op: '^' }, 
      'vehicleRequirements.vechicleType': { op: '^' }, 
      'pickup.address.organisation': { op: '%' }, 
      'pickup.address.address': { op: '%' }, 
      'pickup.address.location': { op: '%' }, 
      'pickup.address.zip': { op: '=' }, 
      'pickup.contact.firstName': { op: '^' },
      'pickup.contact.lastName': { op: '^' }, 
      'pickup.contact.mobile': { op: '=' }, 
      'pickup.contact.email': { op: '^' }, 
      'pickup.contact.alternativePhone': { op: '=' }, 
      'drop.address.organisation': { op: '%' }, 
      'drop.address.address': { op: '%' }, 
      'drop.address.location': { op: '%' }, 
      'drop.address.zip': { op: '=' }, 
      'drop.contact.firstName': { op: '^' }, 
      'drop.contact.lastName': { op: '^' }, 
      'drop.contact.mobile': { op: '=' }, 
      'drop.contact.email': { op: '^' }, 
      'drop.contact.alternativePhone': { op: '=' }
   },
   get: {
       callback: (schema, serviceConfig, req, options, cb) => {//callback hook  - after serving the request - forms & grid
         console.log('get callback');
         const model = require('mongoose').model(collection);
         console.log(req.query);
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