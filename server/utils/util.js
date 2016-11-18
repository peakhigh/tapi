export default { 
   cloneObject: function (source, destination) {
      for (let prop in source) {
         if (source.hasOwnProperty(prop)) {
            destination[prop] = source[prop];
         }
      }
      return destination;
   },
   setObjectProperty: function (key, value) {
      let obj = {};
      obj[key] = value;
      Object.prototype.setObjectProperty = function (k, v) {
         this[k] = v;
         return this;
      };
      return obj;
   }
};