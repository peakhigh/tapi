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
         let roleBasedHtmlSchemas = {};
         let roleBasedDBSchemas = {};
         // Object.keys(cache.APP_CONFIG).forEach((appKey) => {// for each application
         //    Object.keys(cache.APP_CONFIG[appKey].ROLES).forEach((role) => {//for each role
         //       schemas[appKey+constants.CONFIG_KEY_SEPERATOR+cache.APP_CONFIG[appKey].ROLES[role].Code+constants.CONFIG_KEY_SEPERATOR+'Form'] = {};
         //       schemas[appKey+constants.CONFIG_KEY_SEPERATOR+cache.APP_CONFIG[appKey].ROLES[role].Code+constants.CONFIG_KEY_SEPERATOR+'Grid'] = {};
         //    });
         // });
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
                     let cacheKey = appKey + constants.CONFIG_KEY_SEPERATOR + cache.APP_CONFIG[appKey].ROLES[role].Code + constants.CONFIG_KEY_SEPERATOR + options.collection;
                     let formKey = cacheKey + constants.CONFIG_KEY_SEPERATOR + constants.CONFIG_KEY_FORM_PREFIX;
                     let gridKey = cacheKey + constants.CONFIG_KEY_SEPERATOR + constants.CONFIG_KEY_GRID_PREFIX;
                     let dbKey = cacheKey + constants.CONFIG_KEY_SEPERATOR + constants.CONFIG_KEY_DB_PREFIX;

                     if (!roleBasedHtmlSchemas[formKey]) {
                        roleBasedHtmlSchemas[formKey] = {};
                     }
                     //create schemas for form & grid for this collection
                     //1. process form attributes
                     roleBasedHtmlSchemas[formKey][field] = fSchema[field];//attach the common props
                     if (htmlOnly && Object.keys(htmlOnly).length > 0) {
                        utils.cloneObject(htmlOnly, roleBasedHtmlSchemas[formKey][field]);//attach the html specific
                     }
                     if (config && Object.keys(config).length > 0 && config[appKey] && config[appKey][cache.APP_CONFIG[appKey].ROLES[role].code]) {
                        //customization exists for this app, role & field combination 
                        utils.cloneObject(config[appKey][cache.APP_CONFIG[appKey].ROLES[role].code], roleBasedHtmlSchemas[formKey][field]);
                     }
                     //2. process grid attributes
                     //collect the grid attributes

                     //3. process role based dbschema into cache which can be used for validations on every form submits etc to validate data
                  });
               });
         });
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