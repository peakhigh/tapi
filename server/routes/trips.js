const controller = require('../controllers/trips');
const BaseRoute = require('./base');

const baseRoute = new BaseRoute({ controller: controller, collection: 'Trips'});

module.exports = baseRoute.router;