const controller = require('../controllers/accounts');
const BaseRoute = require('./base');

const baseRoute = new BaseRoute({ controller: controller, collection: 'Accounts'});

module.exports = baseRoute.router;