import config from '../../config/env';
import jwt from 'jsonwebtoken';

export default { 
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