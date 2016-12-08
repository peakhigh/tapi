'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _APIError = require('../helpers/APIError');

var _APIError2 = _interopRequireDefault(_APIError);

var _globals = require('../utils/globals');

var _globals2 = _interopRequireDefault(_globals);

var _util = require('../utils/util');

var _util2 = _interopRequireDefault(_util);

var _cache = require('../utils/cache');

var _cache2 = _interopRequireDefault(_cache);

var _constants = require('../config/constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseSchema = function BaseSchema(options) {
   var _this = this;

   _classCallCheck(this, BaseSchema);

   this.filterSchema = function () {
      var fSchema = options.schema;
      var dbSchema = {};
      if (!options.excludeDates) {
         _this.getDateColumns(fSchema);
      }
      if (!options.excludeOwner) {
         _this.getOwnerColumns(fSchema);
      }
      var roleBasedHtmlSchemas = {};
      var roleBasedDBSchemas = {};
      // Object.keys(cache.APP_CONFIG).forEach((appKey) => {// for each application
      //    Object.keys(cache.APP_CONFIG[appKey].ROLES).forEach((role) => {//for each role
      //       schemas[appKey+constants.CONFIG_KEY_SEPERATOR+cache.APP_CONFIG[appKey].ROLES[role].Code+constants.CONFIG_KEY_SEPERATOR+'Form'] = {};
      //       schemas[appKey+constants.CONFIG_KEY_SEPERATOR+cache.APP_CONFIG[appKey].ROLES[role].Code+constants.CONFIG_KEY_SEPERATOR+'Grid'] = {};
      //    });
      // });
      //globals.defineGlobal('TEST', 'TEST123', false, false);
      Object.keys(fSchema).forEach(function (field) {
         //set title if not exists
         if (!fSchema[field].title) {
            //camelcase to uppercase. step 1)insert a space before all caps. step 2)uppercase the first character
            fSchema[field].title = field.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
               return str.toUpperCase();
            });
         }

         var htmlOnly = fSchema[field].html;
         delete fSchema[field].html;
         var dbOnly = fSchema[field].db;
         delete fSchema[field].db;
         var config = fSchema[field].config;
         delete fSchema[field].config;

         //now fSchema[field] contains the common properties for that field

         //set dbschema
         dbSchema[field] = fSchema[field]; //get the common props
         if (dbOnly && Object.keys(dbOnly).length > 0) {
            _util2.default.cloneObject(dbOnly, dbSchema); //attach the db specific
         }

         Object.keys(_cache2.default.APP_CONFIG).forEach(function (appKey) {
            // for each application
            Object.keys(_cache2.default.APP_CONFIG[appKey].ROLES).forEach(function (role) {
               //for each role
               var cacheKey = appKey + _constants2.default.CONFIG_KEY_SEPERATOR + _cache2.default.APP_CONFIG[appKey].ROLES[role].Code + _constants2.default.CONFIG_KEY_SEPERATOR + options.collection;
               var formKey = cacheKey + _constants2.default.CONFIG_KEY_SEPERATOR + _constants2.default.CONFIG_KEY_FORM_PREFIX;
               var gridKey = cacheKey + _constants2.default.CONFIG_KEY_SEPERATOR + _constants2.default.CONFIG_KEY_GRID_PREFIX;
               var dbKey = cacheKey + _constants2.default.CONFIG_KEY_SEPERATOR + _constants2.default.CONFIG_KEY_DB_PREFIX;

               if (!roleBasedHtmlSchemas[formKey]) {
                  roleBasedHtmlSchemas[formKey] = {};
               }
               //create schemas for form & grid for this collection
               //1. process form attributes
               roleBasedHtmlSchemas[formKey][field] = fSchema[field]; //attach the common props
               if (htmlOnly && Object.keys(htmlOnly).length > 0) {
                  _util2.default.cloneObject(htmlOnly, roleBasedHtmlSchemas[formKey][field]); //attach the html specific
               }
               if (config && Object.keys(config).length > 0 && config[appKey] && config[appKey][_cache2.default.APP_CONFIG[appKey].ROLES[role].code]) {
                  //customization exists for this app, role & field combination 
                  _util2.default.cloneObject(config[appKey][_cache2.default.APP_CONFIG[appKey].ROLES[role].code], roleBasedHtmlSchemas[formKey][field]);
               }
               //2. process grid attributes
               //collect the grid attributes

               //3. process role based dbschema into cache which can be used for validations on every form submits etc to validate data
            });
         });
      });
      return dbSchema;
   };
   this.attachHooks = function () {
      /**
      * Add your
      * - pre-save hooks
      * - validations
      * - virtuals
      */
   };
   this.attachMethods = function () {
      /**
      * Methods
      */
      _this.schema.method({});
   };
   this.attachStatics = function () {
      _this.schema.statics = {
         /**
         * Get
         * @param {ObjectId} id - The objectId of schema.
         * @returns {Promise<User, APIError>}
         */
         get: function get(id) {
            return this.findById(id).execAsync().then(function (user) {
               if (user) {
                  return user;
               }
               var err = new _APIError2.default('No such user exists!', _httpStatus2.default.NOT_FOUND);
               return _bluebird2.default.reject(err);
            });
         },


         /**
         * List records in descending order of 'createdAt' timestamp.
         * @param {number} skip - Number of users to be skipped.
         * @param {number} limit - Limit number of users to be returned.
         * @returns {Promise<User[]>}
         */
         list: function list() {
            var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var _ref$skip = _ref.skip;
            var skip = _ref$skip === undefined ? 0 : _ref$skip;
            var _ref$limit = _ref.limit;
            var limit = _ref$limit === undefined ? 50 : _ref$limit;

            return this.find().sort({ createdAt: -1 }).skip(skip).limit(limit).execAsync();
         }
      };
   };
   this.getOwnerColumns = function (schema) {
      schema.owner = {
         type: String
      };
   };
   this.getDateColumns = function (schema) {
      schema.createdAt = {
         type: Date,
         default: Date.now
      };
      schema.updatedAt = {
         type: Date,
         default: Date.now
      };
   };

   this.schema = new _mongoose2.default.Schema(this.filterSchema());
   this.attachHooks();
   this.attachMethods();
   this.attachStatics();

   this.getSchema = function () {
      return _mongoose2.default.model(options.collection, _this.schema);
   };
};

exports.default = BaseSchema;
module.exports = exports['default'];
//# sourceMappingURL=base.js.map
