const utils = require('./util');

module.exports = {
   date: function (isArray, options) {
      return utils.getSchemaTypeObject({
         type: Date,
         html: {
            format: 'datetime'
         }   
      }, isArray, options);
   },
   email: function (isArray, options) {  
      return utils.getSchemaTypeObject({
         type: String,
         html: {
            format: 'email'
         } 
      }, isArray, options);
   },
   mobile: function (isArray, options) {  
      return utils.getSchemaTypeObject({            
         type: Number,
         html: {
            format: 'phone',
            type: 'string'  
         }
      }, isArray, options);
   },
   zip: function (isArray, options) {
      return utils.getSchemaTypeObject({
         type: String,
         html: {
            minLength: 5,
            maxLength: 6
            // form: {
               // type: 'zipcode'
               // format: 'six'
            // }
         } 
      }, isArray, options);
   },
   description: function (isArray, options) {      
      return utils.getSchemaTypeObject({
         type: String,
         html: {
            form: {
               type: 'textarea'
            }
         }
      }, isArray, options);
   }
};