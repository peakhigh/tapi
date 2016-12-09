import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import globals from '../utils/globals';
import utils from '../utils/util';
import cache from '../utils/cache';
import constants from '../config/constants';

export default class BaseSchema {
   constructor(options) {      
      this.filterSchema = () => {
         let fSchema = options.schema;
         let dbSchema = {};
         if (!options.excludeDates) {
            this.getDateColumns(fSchema);
         }
         if (!options.excludeOwner) {
            this.getOwnerColumns(fSchema);
         }
         let roleBasedSchemas = {};
         //globals.defineGlobal('TEST', 'TEST123', false, false);         
         Object.keys(fSchema).forEach((field) => {
               //set title if not exists
               if (!fSchema[field].title) {
                  //camelcase to uppercase. step 1)insert a space before all caps. step 2)uppercase the first character
                  fSchema[field].title = field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => { return str.toUpperCase(); });
               }
            
               let htmlOnly = fSchema[field].html;
               delete fSchema[field].html;
               let dbOnly = fSchema[field].db;
               delete fSchema[field].db;
               let config = fSchema[field].config;
               delete fSchema[field].config;

               //now fSchema[field] contains the common properties for that field

               //set dbschema
               dbSchema[field] = fSchema[field];//get the common props
               if (dbOnly && Object.keys(dbOnly).length > 0) {
                  utils.cloneObject(dbOnly, dbSchema);//attach the db specific
               }

               Object.keys(cache.APP_CONFIG).forEach((appKey) => {// for each application
                  Object.keys(cache.APP_CONFIG[appKey].ROLES).forEach((role) => {//for each role      
                     //application key + role code + collection name
                     let cacheKey = appKey + constants.CONFIG_KEY_SEPERATOR + cache.APP_CONFIG[appKey].ROLES[role].Code + constants.CONFIG_KEY_SEPERATOR + options.collection;
                     let formKey = cacheKey + constants.CONFIG_KEY_SEPERATOR + constants.CONFIG_KEY_FORM_SUFFIX;
                     let gridKey = cacheKey + constants.CONFIG_KEY_SEPERATOR + constants.CONFIG_KEY_GRID_SUFFIX;
                     let dbKey = cacheKey + constants.CONFIG_KEY_SEPERATOR + constants.CONFIG_KEY_DB_SUFFIX;
                     if (!roleBasedSchemas[formKey]) {//for first field, initialize
                        roleBasedSchemas[formKey] = {};
                     }
                     if (!roleBasedSchemas[gridKey]) {//for first field, initialize
                        roleBasedSchemas[gridKey] = {};
                     }
                     if (!roleBasedSchemas[dbKey]) {//for first field, initialize
                        roleBasedSchemas[dbKey] = {};
                     }

                     //create schemas for form & grid for this collection
                     let currentRoleHtmlOnlyAttrs = null;
                     let currentRoleDBOnlyAttrs = null;
                     if (config && Object.keys(config).length > 0 && config[appKey] && config[appKey].html && config[appKey].html.roles_config && config[appKey].html.roles_config[cache.APP_CONFIG[appKey].ROLES[role].Code]) {
                        currentRoleHtmlOnlyAttrs = config[appKey].html.roles_config[cache.APP_CONFIG[appKey].ROLES[role].Code];
                     }
                     if (config && Object.keys(config).length > 0 && config[appKey] && config[appKey].db && config[appKey].db.roles_config && config[appKey].db.roles_config[cache.APP_CONFIG[appKey].ROLES[role].Code]) {
                        currentRoleDBOnlyAttrs = config[appKey].db.roles_config[cache.APP_CONFIG[appKey].ROLES[role].Code];
                     }

                     //1. process form attributes
                     roleBasedSchemas[formKey][field] = fSchema[field];//attach the common props
                     if (htmlOnly && Object.keys(htmlOnly).length > 0) {
                        utils.cloneObject(htmlOnly, roleBasedSchemas[formKey][field]);//attach the html specific
                     }
                     if (currentRoleHtmlOnlyAttrs) {
                        //customization exists for this app, role & field combination 
                        utils.cloneObject(currentRoleHtmlOnlyAttrs, roleBasedSchemas[formKey][field]);
                     }
                     //2. process grid attributes                     
                     if (options.gridAttributes && options.gridAttributes.length > 0) {//collect the grid attributes
                        roleBasedSchemas[gridKey][field] = {};
                        options.gridAttributes.forEach((attr) => {
                           if (currentRoleHtmlOnlyAttrs && currentRoleHtmlOnlyAttrs[attr]) {//get from role based html specific
                              roleBasedSchemas[gridKey][field][attr] = currentRoleHtmlOnlyAttrs[attr];
                           } else if (htmlOnly && htmlOnly[attr]) {//get from general html specific
                              roleBasedSchemas[gridKey][field][attr] = htmlOnly[attr];
                           } else {//get from common attributes
                              roleBasedSchemas[gridKey][field][attr] = fSchema[field][attr];
                           }                           
                        });
                     }
                     //3. process role based dbschema into cache which can be used for validations on every form submits etc to validate data                     
                     roleBasedSchemas[dbKey][field] = fSchema[field];//attach the common props first                     
                     if (dbOnly && Object.keys(dbOnly).length > 0) {
                        utils.cloneObject(dbOnly, roleBasedSchemas[dbKey][field]);//now override db specific
                     }
                     if (currentRoleDBOnlyAttrs) {
                        //customization exists for this app, role & field combination 
                        utils.cloneObject(currentRoleDBOnlyAttrs, roleBasedSchemas[formKey][field]);
                     }                                                     
                  });
               });
         });
         //store these role based schemas into cache and return them via apis    
         cache.updateSchemaStore(roleBasedSchemas);
         return dbSchema;
      };          
      this.attachHooks = () => {
         /**
         * Add your
         * - pre-save hooks
         * - validations
         * - virtuals
         */
      };
      this.attachMethods = () => {
         /**
         * Methods
         */
         this.schema.method({
         });
      };
      this.attachStatics = () => {
         this.schema.statics = {
            /**
            * Get
            * @param {ObjectId} id - The objectId of schema.
            * @returns {Promise<User, APIError>}
            */
            get(id) {
               return this.findById(id)
                  .execAsync().then((user) => {
                     if (user) {
                        return user;
                     }
                     const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
                     return Promise.reject(err);
                  });
            },

            /**
            * List records in descending order of 'createdAt' timestamp.
            * @param {number} skip - Number of users to be skipped.
            * @param {number} limit - Limit number of users to be returned.
            * @returns {Promise<User[]>}
            */
            list({ skip = 0, limit = 50 } = {}) {
               return this.find()
                  .sort({ createdAt: -1 })
                  .skip(skip)
                  .limit(limit)
                  .execAsync();
            }
         };
      };
      this.getOwnerColumns = (schema) => {
         schema.owner = {
            type: String
         };
      };
      this.getDateColumns = (schema) => {
         schema.createdAt = {
            type: Date,
            default: Date.now
         };
         schema.updatedAt = {
            type: Date,
            default: Date.now
         };
      };

      this.schema = new mongoose.Schema(this.filterSchema());  
      this.attachHooks();
      this.attachMethods();
      this.attachStatics();

      this.getSchema = () => mongoose.model(options.collection, this.schema);      
   }
}