let Schema = require('mongoose').Schema;
const collection = 'Users';
module.exports = {
   type: 'grid',
   schemaFields: ['userName', 'firstName', 'lastName', 'gender', 'email', 'mobile', 'alternativePhone',
                            'organisationAddress', 'profile'], // pick fields configuration from default schema
   get: {
       callback: (schema, serviceConfig, req, res, options, cb) => {//callback hook  - after serving the request - forms & grid
         console.log('get callback');
         const model = require('mongoose').model(collection);
         model.listFields(req.query, {
            selectFields: serviceConfig.schemaFields,
            response: {
               schema: schema
            }
         }, cb);
      }
   }
};
