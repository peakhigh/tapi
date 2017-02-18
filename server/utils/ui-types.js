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
   }   
};