'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _expressJwt = require('express-jwt');

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _cache = require('../utils/cache');

var _cache2 = _interopRequireDefault(_cache);

var _env = require('../../config/env');

var _env2 = _interopRequireDefault(_env);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseRouter = function BaseRouter(options) {
   _classCallCheck(this, BaseRouter);

   this.router = _express2.default.Router();

   this.router.route('/')
   /** GET - Get list of current collection documents */
   .get((0, _expressJwt2.default)({ secret: _env2.default.jwtSecret }), options.controller.currentModel.list)

   /** POST - Create new document of current collection */
   .post((0, _expressJwt2.default)({ secret: _env2.default.jwtSecret }), options.controller.currentModel.create);

   /** TODO: complete add/edit/delete/search */

   /** get /form - return form schema of current collection */
   this.router.route('/form').get((0, _expressJwt2.default)({ secret: _env2.default.jwtSecret }), function (req, res, next) {
      return res.json(_cache2.default.getRequestSchema(req));
   });

   /** get /grid - return grid schema of current collection */
   this.router.route('/grid').get((0, _expressJwt2.default)({ secret: _env2.default.jwtSecret }), function (req, res, next) {
      return res.json(_cache2.default.getRequestSchema(req));
   });

   /** get /db - return db schema of current collection -- only testing purpose */
   this.router.route('/db').get((0, _expressJwt2.default)({ secret: _env2.default.jwtSecret }), function (req, res, next) {
      return res.json(_cache2.default.getRequestSchema(req));
   });
};

exports.default = BaseRouter;
module.exports = exports['default'];
//# sourceMappingURL=base.js.map
