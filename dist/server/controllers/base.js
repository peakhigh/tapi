"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseModel = function BaseModel(options) {
  var _this = this;

  _classCallCheck(this, BaseModel);

  this.Model = options.model;

  this.create = function (req, res, next) {
    var entry = new _this.Model(req.body.entry);

    entry.saveAsync().then(function (savedEntry) {
      return res.json(savedEntry);
    }).error(function (e) {
      return next(e);
    });
  };

  this.list = function (req, res, next) {
    var _req$query = req.query;
    var _req$query$limit = _req$query.limit;
    var limit = _req$query$limit === undefined ? 50 : _req$query$limit;
    var _req$query$skip = _req$query.skip;
    var skip = _req$query$skip === undefined ? 0 : _req$query$skip;

    _this.Model.list({ limit: limit, skip: skip }).then(function (entries) {
      return res.json(entries);
    }).error(function (e) {
      return next(e);
    });
  };
};

exports.default = BaseModel;
module.exports = exports['default'];
//# sourceMappingURL=base.js.map
