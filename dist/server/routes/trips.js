'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _paramValidation = require('../../config/param-validation');

var _paramValidation2 = _interopRequireDefault(_paramValidation);

var _trips = require('../controllers/trips');

var _trips2 = _interopRequireDefault(_trips);

var _expressJwt = require('express-jwt');

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _env = require('../../config/env');

var _env2 = _interopRequireDefault(_env);

var _globals = require('../utils/globals');

var _globals2 = _interopRequireDefault(_globals);

var _util = require('../utils/util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(); // eslint-disable-line new-cap

//console.log('.....** ', tripsCtrl.currentModel);
router.route('/')
/** GET /api/users - Get list of users */
.get((0, _expressJwt2.default)({ secret: _env2.default.jwtSecret }), _trips2.default.currentModel.list)

/** POST /api/users - Create new user */
.post((0, _expressJwt2.default)({ secret: _env2.default.jwtSecret }), _trips2.default.currentModel.create);

router.route('/form').get(function (req, res, next) {
  //  var uid = req.params.uid,
  //      path = req.params[0] ? req.params[0] : 'index.html';
  res.sendfile('static/test.json', { root: './server' });
});

router.route('/formglobal').get(function (req, res, next) {
  //  var uid = req.params.uid,
  //      path = req.params[0] ? req.params[0] : 'index.html';
  //  console.log('...', utils.setObjectProperty('name', {key: 1}).setObjectProperty('age', 20));
  return res.json({
    value: '' //globals.TEST
  });
});

// router.route('/:userId')
//   /** GET /api/users/:userId - Get user */
//   .get(testCtrl.get);

//   /** PUT /api/users/:userId - Update user */
//   .put(validate(paramValidation.updateUser), userCtrl.update)

//   /** DELETE /api/users/:userId - Delete user */
//   .delete(userCtrl.remove);

/** Load user when API with userId route parameter is hit */
//router.param('userId', testCtrl.baseModel.load);

exports.default = router;
module.exports = exports['default'];
//# sourceMappingURL=trips.js.map
