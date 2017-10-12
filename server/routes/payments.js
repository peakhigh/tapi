const controller = require('../controllers/payments');
const BaseRoute = require('./base');

const baseRoute = new BaseRoute({ controller: controller, collection: 'Payments'});

module.exports = baseRoute.router;