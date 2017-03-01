const controller = require('../controllers/drivers');
const BaseRoute = require('./base');

const baseRoute = new BaseRoute({ controller: controller, collection: 'Drivers'});

module.exports = baseRoute.router;