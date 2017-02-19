module.exports = { 
   httpError: function (req, msg) {
      let out = {
         success: false
      };
      if (msg) {
         out.message = msg;
      } else {
         out.message = 'Internal Server Error';
      }
      return out;
   }
};