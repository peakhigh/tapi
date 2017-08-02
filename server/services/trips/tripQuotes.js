/* dont use imports, use require, because errors are coming when we are dynamically using services in the base model*/
let uiTypes = require('../../utils/ui-types');
let authUtils = require('../../utils/auth');
const collection = 'Requests';
module.exports = {
   type: 'custom',
   requestType: 'get',
   schemaFields: ['message', 'type', 'fromUser', 'toUser', 'status', 'priceQuote', 'rating', 'itemId'], // pick fields configuration from default schema
   schemaOverrideFeilds: {
   },
   get: {
      preValidate: (serviceConfig, req, res, options, cb) => {//on init hook, will get executed on service request - init
         console.log('get prevalidate');
      //   if (!req.params.id) {
       //     return cb('Invalid Request');//if error, return as first argument
        // }
         return cb();
      },
      callback: (schema, serviceConfig, req, res, options, cb) => {//callback hook  - after serving the request - forms & grid
         console.log('get callback', req.params.id);

         const model = require('mongoose').model(collection);
           model.aggregate([
            {
               $match:
               {
                  type: 'Bid',
                  status: 'New'
               }
            },
            {
               $lookup:
               {
                  from: 'trips',
                  localField: 'itemId',
                  foreignField: '_id',
                  as: 'trips'
               }
            }
         ]).execAsync().then((results) => {
            console.log(results);
            return cb(null, {data: results});
         });
      }
   }
};