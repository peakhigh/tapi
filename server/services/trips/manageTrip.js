let Schema = require('mongoose').Schema;
module.exports = {
   type: 'grid',
   schemaFields: ['totalWeight', 'pickup', 'drop', 'comments', 'vehicleRequirements'] // pick fields configuration from default schema
};