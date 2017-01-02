'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
      var self = _this;
      /** ID - is it coming default after add/edit */
      var dbSchema = {};
      if (!options.excludeDates) {
         self.getDateColumns(fSchema);
      }
      if (!options.excludeOwner) {
         self.getOwnerColumns(fSchema);
      }
      var roleBasedSchemas = {};
      Object.keys(fSchema).forEach(function (field) {
         self.processField(self, field, fSchema[field], dbSchema, roleBasedSchemas);
      });
      //store these role based schemas into cache and return them via apis    
      _cache2.default.updateSchemaStore(roleBasedSchemas);
      return dbSchema;
   };
   this.setFieldDetails = function (self, field, fieldData, schemaObject) {
      if (field.indexOf('.') > 0) {
         var fieldPathParts = field.split('.');
         var projection = schemaObject;
         for (var i = 0; i < fieldPathParts.length - 1; i++) {
            if (fieldPathParts[i].indexOf('[') === 0) {
               //array of objects
               fieldPathParts[i] = fieldPathParts[i].replace('[', '').replace(']', '');
               if (!projection[fieldPathParts[i]]) {
                  projection[fieldPathParts[i]] = [{}];
               }
               projection = projection[fieldPathParts[i]][0];
            } else {
               if (!projection[fieldPathParts[i]]) {
                  projection[fieldPathParts[i]] = {};
               }
               projection = projection[fieldPathParts[i]];
            }
         }
         projection[fieldPathParts[fieldPathParts.length - 1]] = fieldData;
      } else {
         schemaObject[field] = fieldData;
      }
   };
   this.processField = function (self, field, fieldData, dbSchema, roleBasedSchemas) {
      if (fieldData instanceof Array || (typeof fieldData === 'undefined' ? 'undefined' : _typeof(fieldData)) === 'object' && typeof fieldData.type === 'undefined') {
         //indicates a nested field
         if (fieldData instanceof Array) {
            Object.keys(fieldData[0]).forEach(function (nestedField) {
               self.processField(self, '[' + field + '].' + nestedField, fieldData[0][nestedField], dbSchema, roleBasedSchemas);
            });
         } else {
            Object.keys(fieldData).forEach(function (nestedField) {
               self.processField(self, field + '.' + nestedField, fieldData[nestedField], dbSchema, roleBasedSchemas);
            });
         }
         return;
      }
      var fieldParts = field.split('.');

      //set title if not exists
      if (typeof fieldData.title === 'undefined') {
         //camelcase to uppercase. step 1)insert a space before all caps. step 2)uppercase the first character
         if (fieldParts.length > 0) {
            //if parent path exists
            fieldData.title = fieldParts[fieldParts.length - 1].replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
               return str.toUpperCase();
            });
         } else {
            fieldData.title = field.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
               return str.toUpperCase();
            });
         }
      }

      var htmlOnly = fieldData.html;
      delete fieldData.html;
      var dbOnly = fieldData.db;
      delete fieldData.db;
      var config = fieldData.config;
      delete fieldData.config;

      //now fieldData contains the common properties for that field

      //set dbschema
      var fieldDBData = {};
      _util2.default.cloneObject(fieldDBData, fieldData); //get the common props
      if (dbOnly && Object.keys(dbOnly).length > 0) {
         _util2.default.cloneObject(dbOnly, fieldDBData); //attach the db specific
      }
      self.setFieldDetails(self, field, fieldDBData, dbSchema);

      var stringifiedFieldSchema = {}; //stringified types, default values etc
      Object.keys(fieldData).forEach(function (key) {
         if (typeof fieldData[key] === 'function') {
            stringifiedFieldSchema[key] = fieldData[key].name;
         } else {
            stringifiedFieldSchema[key] = fieldData[key];
         }
      });

      Object.keys(_cache2.default.APP_CONFIG).forEach(function (appKey) {
         // for each application
         Object.keys(_cache2.default.APP_CONFIG[appKey].ROLES).forEach(function (role) {
            //for each role      
            //application key + role code + collection name
            var cacheKey = appKey + _constants2.default.CONFIG_KEY_SEPERATOR + _cache2.default.APP_CONFIG[appKey].ROLES[role].Code + _constants2.default.CONFIG_KEY_SEPERATOR + options.collection;
            var formKey = cacheKey + _constants2.default.CONFIG_KEY_SEPERATOR + _constants2.default.CONFIG_KEY_FORM_SUFFIX;
            var gridKey = cacheKey + _constants2.default.CONFIG_KEY_SEPERATOR + _constants2.default.CONFIG_KEY_GRID_SUFFIX;
            var dbKey = cacheKey + _constants2.default.CONFIG_KEY_SEPERATOR + _constants2.default.CONFIG_KEY_DB_SUFFIX;
            formKey = formKey.toUpperCase();
            gridKey = gridKey.toUpperCase();
            dbKey = dbKey.toUpperCase();
            if (!roleBasedSchemas[formKey]) {
               //for first field, initialize
               roleBasedSchemas[formKey] = {};
            }
            if (!roleBasedSchemas[gridKey]) {
               //for first field, initialize
               roleBasedSchemas[gridKey] = {};
            }
            if (!roleBasedSchemas[dbKey]) {
               //for first field, initialize
               roleBasedSchemas[dbKey] = {};
            }

            //create schemas for form & grid for this collection
            var currentRoleHtmlOnlyAttrs = null;
            var currentRoleDBOnlyAttrs = null;
            if (config && Object.keys(config).length > 0 && config[appKey] && config[appKey].html && config[appKey].html.roles_config && config[appKey].html.roles_config[_cache2.default.APP_CONFIG[appKey].ROLES[role].Code]) {
               currentRoleHtmlOnlyAttrs = config[appKey].html.roles_config[_cache2.default.APP_CONFIG[appKey].ROLES[role].Code];
            }
            if (config && Object.keys(config).length > 0 && config[appKey] && config[appKey].db && config[appKey].db.roles_config && config[appKey].db.roles_config[_cache2.default.APP_CONFIG[appKey].ROLES[role].Code]) {
               currentRoleDBOnlyAttrs = config[appKey].db.roles_config[_cache2.default.APP_CONFIG[appKey].ROLES[role].Code];
            }

            //1. process form attributes
            var fieldFormData = {};
            _util2.default.cloneObject(stringifiedFieldSchema, fieldFormData); //attach the common props                
            if (htmlOnly && Object.keys(htmlOnly).length > 0) {
               _util2.default.cloneObject(htmlOnly, fieldFormData); //attach the html specific
            }
            if (currentRoleHtmlOnlyAttrs) {
               //customization exists for this app, role & field combination 
               _util2.default.cloneObject(currentRoleHtmlOnlyAttrs, fieldFormData);
            }
            self.setFieldDetails(self, field, fieldFormData, roleBasedSchemas[formKey]);

            //2. process grid attributes                     
            if (options.gridAttributes && options.gridAttributes.length > 0) {
               (function () {
                  //collect the grid attributes
                  // roleBasedSchemas[gridKey][field] = {};
                  var fieldGridData = {};
                  options.gridAttributes.forEach(function (attr) {
                     if (currentRoleHtmlOnlyAttrs && currentRoleHtmlOnlyAttrs[attr]) {
                        //get from role based html specific
                        fieldGridData[attr] = currentRoleHtmlOnlyAttrs[attr];
                     } else if (htmlOnly && htmlOnly[attr]) {
                        //get from general html specific
                        fieldGridData[attr] = htmlOnly[attr];
                     } else {
                        //get from common attributes
                        fieldGridData[attr] = stringifiedFieldSchema[attr];
                     }
                  });
                  self.setFieldDetails(self, field, fieldGridData, roleBasedSchemas[gridKey]);
               })();
            }
            //3. process role based dbschema into cache which can be used for validations on every form submits etc to validate data      
            var fieldRoleDBData = {};
            _util2.default.cloneObject(stringifiedFieldSchema, fieldRoleDBData); //attach the common props first       
            if (dbOnly && Object.keys(dbOnly).length > 0) {
               _util2.default.cloneObject(dbOnly, fieldRoleDBData); //now override db specific
            }
            if (currentRoleDBOnlyAttrs) {
               //customization exists for this app, role & field combination 
               _util2.default.cloneObject(currentRoleDBOnlyAttrs, fieldRoleDBData);
            }
            self.setFieldDetails(self, field, fieldRoleDBData, roleBasedSchemas[dbKey]);
         });
      });
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
      schema.createdBy = {
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
