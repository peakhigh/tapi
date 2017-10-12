/* dont use imports, use require, because errors are coming when we are dynamically using services in the base model*/
let uiTypes = require('../../utils/ui-types');
const extend = require('extend');
// let ObjectID = require('mongodb').ObjectID;
// const model = require('../../models/trucks'); 
const collection = 'Accounts';
module.exports = {
   type: 'form',
   requestType: 'get',
   schemaFields: ['accountNumber', 'accountName', 'bankName', 'ifscCode', 'branchAddress'], // pick fields configuration from default schema
   
   get: {
       callback: (schema, serviceConfig, req, res, options, cb) => {//callback hook  - after serving the request - forms & grid
         console.log('get callback');
         const model = require('mongoose').model(collection);
         console.log(req.query);

         let where = {};
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
