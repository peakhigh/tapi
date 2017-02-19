module.exports = { 
   select: (options) => { 
      let obj = {
         required: true,
         form: {
            sort: false,
            noneLabel: '-- Select --',
            removeDefaultNone: false
         }
      };
      return obj;
   },
   weightUnit: (options) => { 
      let obj = {
         type: String,
         enum: ['Tons', 'Litres'],
         default: 'Tons',
         html: {                  
            sort: false,                 
            form: {
               type: 'select',
               removeDefaultNone: true
            }
         }  
      };
      return obj;
   },
   materialType: (options) => {
      let obj = {
         type: String,               
         enum: ['Normal', 'Brittle'],
         html: {                 
            form: {
               type: 'select'
            }
         }    
      };
      return obj;
   } 
};