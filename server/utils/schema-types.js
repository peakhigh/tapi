const utils = require('./util');
let Schema = require('mongoose').Schema;

module.exports = {
   date: function (isArray, options) {
      return utils.getSchemaTypeObject({
         type: Schema.Types.Date,
         html: {
            format: 'datetime'
         }   
      }, isArray, options);
   },
   email: function (isArray, options) {  
      return utils.getSchemaTypeObject({
         type: Schema.Types.String,
         html: {
            format: 'email'
         } 
      }, isArray, options);
   },
   mobile: function (isArray, options) {  
      return utils.getSchemaTypeObject({            
         type: Schema.Types.Number,
         html: {
            format: 'phone',
            type: 'string'  
         }
      }, isArray, options);
   },
   zip: function (isArray, options) {
      return utils.getSchemaTypeObject({
         type: Schema.Types.String,
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
         type: Schema.Types.String,
         html: {
            form: {
               type: 'textarea'
            }
         }
      }, isArray, options);
   }
};