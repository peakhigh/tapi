/* dont use imports, use require, because errors are coming when we are dynamically using services in the base model*/
let uiTypes = require('../../utils/ui-types');
const extend = require('extend');
// let ObjectID = require('mongodb').ObjectID;
// const model = require('../../models/trucks'); 
const collection = 'Trucks';
module.exports = {
   type: 'form',
   requestType: 'get',
   schemaFields: ['plateNumber', 'licenseNumber', 'model', 'engineNumber', 'truckType',
                      'capacity', 'capacityUnits', 'insurance.startDate', 'insurance.expiryDate', 
                        'material.Type', 'description', 'status', 'driverId', 'currentPoint', 'nextAvailableAt', 'nextFreeDate'], // pick fields configuration from default schema
   
   get: {
       callback: (schema, serviceConfig, req, res, options, cb) => {//callback hook  - after serving the request - forms & grid
         console.log('get callback');
         const model = require('mongoose').model(collection);
         console.log(req.query);
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
