   /* dont use imports, use require, because errors are coming when we are dynamically using services in the base model*/
let uiTypes = require('../../utils/ui-types');
let authUtils = require('../../utils/auth');
let ObjectID = require('mongodb').ObjectID;

const collection = 'Trips';
module.exports = {
   type: 'form',
   requestType: 'get',
   schemaFields: ['quotes.quotetype', 'quotes.costPerTon', 'quotes.loadingPerTon', 'quotes.unLoadingPerTon',
                'quotes.cost', 'quotes.comment'], // pick fields configuration from default schema
   schemaOverrideFeilds: {

   },
   get: {
      preValidate: (serviceConfig, req, res, options, cb) => {//on init hook, will get executed on service request - init
         console.log('get prevalidate');
        /*  if (!req.params.id) {
            return cb('Invalid Request');//if error, return as first argument
         }  */
         return cb();        
      },
      callback: (schema, serviceConfig, req, res, options, cb) => {//callback hook  - after serving the request - forms & grid
         console.log('get callback', req.params.id);
         const model = require('mongoose').model(collection);
           if (req.params.id) {
            cb(null, {
               data:  {
                  _id: req.params.id
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
         /*  if (!req.body._id) {
            return cb('Invalid Request');//if error, return as first argument
         }  */
         return cb();   
      },
      callback: (serviceConfig, req, res, options, cb) => { //callback hook  for post request
         console.log('post callback');
         const model = require('mongoose').model(collection);
         let data = req.body;
       /*   let tokenDetails = authUtils.decodeToken(req.headers);
         if (tokenDetails && tokenDetails.username && tokenDetails.role) {
            data.fromUser = tokenDetails.username;  //it should be an unique id
          //  data.quotes.userRole = tokenDetails.role;
         } 
         data.itemId = new ObjectID(data.itemId); */
        
/* 
         let tokenDetails = authUtils.decodeToken(req.headers);
         let comment = {
             date: new Date().toLocaleString(),
             commentedby: tokenDetails.username,
             comment: req.body.quotes[0].quote
          };
         data.$push = { comments: comment }; */
         console.log(data);
         data.status = 'Quoted';
         model.addOrEdit(data, null, cb);
      }
   }
};