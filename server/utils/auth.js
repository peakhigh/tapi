const config = require('../../config/env');
const jwt = require('jsonwebtoken');

module.exports = { 
   decodeToken: function (requestHeaders) {//returns token details 
      if (requestHeaders && requestHeaders.authorization) {
         let tokenParts = requestHeaders.authorization.toString().trim().split(' ');
         if (tokenParts.length === 2) {
            return jwt.verify(tokenParts[1], config.jwtSecret);
         }
      }     
      return null;
   }
};