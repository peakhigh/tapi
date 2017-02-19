let Schema = require('mongoose').Schema;
const utils = require('./util');
const schemaTypes = require('./schema-types');


function setSchmeaFormOptions(schema, options) {
   Object.keys(schema).forEach((key) => {      
      if (schema[key].properties) {//object
         if (!options[key]) {
            options[key] = {fields:{}};
         }         
         setSchmeaFormOptions(schema[key].properties, options[key].fields);
      } else if (schema[key].items && schema[key].items.properties) {//array of objects
         if (!options[key]) {
            options[key] = {items:{fields:{}}};
         }         
         setSchmeaFormOptions(schema[key].items.properties, options[key].items.fields);    
      } else {//type=string/date/object/[string] etc   
         if (!options[key]) {
            options[key] = {};
         }
         if (schema[key].form && Object.keys(schema[key].form).length > 0) {//clone all form properties      
            Object.keys(schema[key].form).forEach((prop) => {
               options[key][prop] = schema[key].form[prop];
            });  
            delete schema[key].form;       
         }               
      }
   });
}

module.exports = { 
   formatHtmlSchema: (schema) => {   
      let formattedSchema = {//this is designed to work for alpaca plugin
         schema: {
            type: 'object',
            properties: schema
         }
      };
      if (schema && Object.keys(schema).length > 0) {
         formattedSchema.options = {
            fields: {}
         };
         setSchmeaFormOptions(formattedSchema.schema.properties, formattedSchema.options.fields);
      }         
      return formattedSchema;
   },
   address: function (isArray) {
      let obj = {
         street: {
            type: String
         },
         state: {
            type: String
         },
         city: {
            type: String
         },         
         zip: schemaTypes.zip()
         // country: { //enable this only when going out of india
         //    type: String
         // }
      };
      return isArray ? [obj] : obj;
   },
   contact: function (isArray) {
      let obj = {
         firstName: {
            type: String
         },
         lastName: {
            type: String
         },
         email: schemaTypes.email(), 
         mobile: schemaTypes.mobile(),
         alternativePhone: schemaTypes.mobile()
      };
      return isArray ? [obj] : obj;
   },
   spend: function (isArray) {
      let obj = {
         spendType: {
            type: String //enum loading, unloading, frieght, driver
         },
         amount: {
            type: Number
         },
         mode: {
            type: String //enum cash, online, etc
         },
         to: {
            type: String,
            required: false
         },
         comment: {
            type: String
         }
      };
      return isArray ? [obj] : obj;
   },
   payment: function (isArray) {
      let obj = {
         paymentType: {
            type: String //enum loading, unloading, frieght, driver
         },
         amount: {
            type: Number
         },
         mode: {
            type: String //enum cash, online, etc
         },
         from: {
            type: String
         },
         comment: {
            type: String
         }
      };
      return isArray ? [obj] : obj;
   },
   tripDoc: function (isArray) {
      let obj = {
         doc: {
            type: String// file upload
         },
         description: {
            type: String
         }
      };
      return isArray ? [obj] : obj;
   },
   tripFormality: function (isArray) {
      let obj = {
         description: {
            type: String
         },
         docs: this.tripDoc(true)
      };
      return isArray ? [obj] : obj;
   },
   comment: function (isArray) {//TODO - need to use this in the future for trips.comments etc
      let obj = {
         comment: {
            type: String
         },
         commentBy: {
            type: Schema.Types.ObjectId
         },
         commentTo: {
            type: Schema.Types.ObjectId,
            required: false
         }
      };     
      return isArray ? [obj] : obj;
   }   
};