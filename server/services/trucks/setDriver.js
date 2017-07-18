let Schema = require('mongoose').Schema;
const collection = 'Trucks';
module.exports = {
   type: 'form',
   requestType: 'get',
   schemaFields: ['driverId'], // pick fields configuration from default schema
   get: {
       callback: (schema, serviceConfig, req, options, cb) => {//callback hook  - after serving the request - forms & grid
         console.log('get callback');
         console.log(schema);
         let driverscollection = 'Drivers';
         const model = require('mongoose').model(driverscollection);
         model.listFields({}, {
            selectFields: ['firstname', 'lastname'],
            response: {
               schema: schema,
               _id: req.params.id
            }
         }, cb);
      }
   },
   post: {
      preValidate: (serviceConfig, req, options, cb) => { //on post - validate, will get executed on POST service request
         console.log('post prevalidate');
         if (!req.query.id) {
            return cb('Invalid Request');//if error, return as first argument
         }
         return cb();//if error, return as first argument
      },
      callback: (serviceConfig, req, options, cb) => { //callback hook  for post request
         console.log('post callback');
         const model = require('mongoose').model(collection);    
         
			let data = {
				_id: req.query.id,
             driverId: req.body.driverid
            };            
            model.editById(data, null, cb);
       }
   }
};