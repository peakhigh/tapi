/* dont use imports, use require, because errors are coming when we are dynamically using services in the base model*/
let uiTypes = require('../../utils/ui-types');
// let ObjectID = require('mongodb').ObjectID;
// const model = require('../../models/trucks'); 
const collection = 'Trucks';
module.exports = {
   type: 'form',
   requestType: 'get',
   schemaFields: ['plateNumber', 'licenseNumber', 'model', 'engineNumber', 'truckType',
                      'capacity', 'capacityUnits', 'insurance.startDate', 'insurance.expiryDate', 
                        'material.Type', 'description', 'status', 'currentPoint', 'nextFreeDate', 
                        'nextAvailableAt', 'nextAssignedDate', 'driverId'], // pick fields configuration from default schema
   
   get: {
       callback: (schema, serviceConfig, req, res, options, cb) => {//callback hook  - after serving the request - forms & grid
         console.log('get callback');
         const model = require('mongoose').model(collection);
         model.listFields({where: JSON.stringify({status: 'busy'})}, {
            selectFields: serviceConfig.schemaFields,
            response: {
               schema: schema
            }
         }, cb);
      }
   }
};
