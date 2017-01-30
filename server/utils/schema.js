let Schema = require('mongoose').Schema;

export default { 
   formatHtmlSchema: function (schema) {            
      return {//this is designed to work for alpaca plugin
         schema: {
            type: 'object',
            properties: schema
         }
      };
   },
   address: function (isArray) {
      let obj = {
         address: {
            type: String
         },
         city: {
            type: String
         },
         state: {
            type: String
         },
         zip: {
            type: String
         },
         country: {
            type: String
         }
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
         email: {
            type: String
         }, 
         mobile: {
            type: Number
         },
         alternativePhone: {
            type: Number
         }
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
   comment: function (isArray) {
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