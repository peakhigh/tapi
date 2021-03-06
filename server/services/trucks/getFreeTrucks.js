/* dont use imports, use require, because errors are coming when we are dynamically using services in the base model*/
let uiTypes = require('../../utils/ui-types');
// let ObjectID = require('mongodb').ObjectID;
// const model = require('../../models/trucks'); 
const collection = 'Trucks';
module.exports = {
   type: 'form',
   requestType: 'get',
   schemaFields: ['createdBy', 'plateNumber', 'licenseNumber', 'model', 'engineNumber', 'truckType',
                      'capacity', 'capacityUnits', 'insurance.startDate', 'insurance.expiryDate', 
                        'material.Type', 'description', 'status', 'driverId', 'currentPoint', 'nextAvailableAt', 'nextFreeDate'], // pick fields configuration from default schema
   
   get: {
       callback: (schema, serviceConfig, req, res, options, cb) => {//callback hook  - after serving the request - forms & grid
         console.log('get callback');
         const model = require('mongoose').model(collection);
         console.log(req.query);
         req.query = {where: JSON.stringify({$or:[{status: 'Free'}]})};
         model.listFields(req.query, {
            selectFields: serviceConfig.schemaFields,
            response: {
               schema: schema,
               _id: req.params.id,
            }
         }, cb);
      }
   }
};
