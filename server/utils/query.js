module.exports = { 
   getQuery: (queryStr, queryType, queryFieldsConfig) => {   
      queryStr = queryStr.trim();
      let queryClauses = [];      
      for (let field in queryFieldsConfig) {
         if (queryFieldsConfig.hasOwnProperty(field)) {
            if (queryFieldsConfig[field]) {
               if (!queryFieldsConfig[field].op) {
                  queryFieldsConfig[field].op = '=';
               }
               let currentClause = {};
               switch (queryFieldsConfig[field].op) {
                  case '=':
                     currentClause[field] = {$regex: new RegExp(`^${queryStr.toLowerCase()}$`, 'i')};                    
                     break;
                  case '^':
                     currentClause[field] = {$regex: new RegExp(`^${queryStr.toLowerCase()}`, 'i')};                    
                     break;
                  case '%':
                     currentClause[field] = {$regex: new RegExp(queryStr.toLowerCase(), 'i')};                    
                     break;
                  default:
                     break;
               }
               queryClauses.push(currentClause);
            }
         }
      }
      let query = {};
      query[`$${(queryType || 'or')}`] = queryClauses;
      return query;
   }   
};