const controller = require('../controllers/requests');
const BaseRoute = require('./base');

const baseRoute = new BaseRoute({ controller: controller, collection: 'Requests'});

module.exports = baseRoute.router;