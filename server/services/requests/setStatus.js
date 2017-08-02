let Schema = require('mongoose').Schema;
const collection = 'Requests';
module.exports = {
   type: 'form',
   requestType: 'get',
   schemaFields: ['status'], // pick fields configuration from default schema
   schemaOverrideFeilds: {
      status: {
         required: true
      }
   },
   get: {
      preValidate: (serviceConfig, req, res, options, cb) => {//on init hook, will get executed on service request - init
         console.log('get prevalidate');
         if (!req.params.id) {
            return cb('Invalid Request');//if error, return as first argument
         }
         return cb();
      },
      callback: (schema, serviceConfig, req, res, options, cb) => {//callback hook  - after serving the request - forms & grid
         console.log('get callback', req.params.id);
         const model = require('mongoose').model(collection);
         if (req.params.id) {
            cb(null, {
               data:  {
                  _id: req.params.id,
                  status: ' '
               },
               schema: schema
            });
         } else {
            cb(null, schema);
         }
      }
   },
   post: {
      preValidate: (serviceConfig, req, res, options, cb) => { //on post - validate, will get executed on POST service request
         console.log('post prevalidate');
         if (!req.query.id) {
            return cb('Invalid Request');//if error, return as first argument
         }
         return cb();//if error, return as first argument
      },
      callback: (serviceConfig, req, res, options, cb) => { //callback hook  for post request
         console.log('post callback');
         const model = require('mongoose').model(collection);        
			let data = {
				_id: req.query.id,
               status: req.query.status
            };            
            model.editById(data, null, cb);
       }
   }
};