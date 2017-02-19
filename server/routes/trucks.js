const controller = require('../controllers/trucks');
const BaseRoute = require('./base');

const baseRoute = new BaseRoute({ controller: controller, collection: 'Trucks'});

module.exports = baseRoute.router;