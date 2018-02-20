/* dont use imports, use require, because errors are coming when we are dynamically using services in the base model*/
let uiTypes = require('../../utils/ui-types');
const extend = require('extend');
const collection = 'Payments';
module.exports = {
   type: 'form',
   requestType: 'get',
   schemaFields: ['amount', 'tripid', 'truckid', 'transferType',
    'status', 'modeOfPayment', 'dateOfPayment', 'transactionid', 'referenceDoc'],
   
   get: {
       callback: (schema, serviceConfig, req, res, options, cb) => {//callback hook  - after serving the request - forms & grid
         console.log('get callback');
         const model = require('mongoose').model(collection);
         console.log(req.params);

         let where = {};

         if (!req.query.querystr) {
            if (req.query.query) {
               where = req.query.query; 
            } else {
               where = {status: req.query.status};
            }
         }

         where.tripid = req.params.id;
       
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
