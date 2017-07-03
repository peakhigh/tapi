const controller = require('../controllers/files');
const BaseRoute = require('./base');

const baseRoute = new BaseRoute({ controller: controller, collection: 'files'});

module.exports = baseRoute.router;