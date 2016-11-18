import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import globals from '../utils/globals';
import utils from '../utils/util';

export default class BaseSchema {
   constructor(options) {      
      this.filterSchema = () => {
         let fSchema = options.schema;
         let dbSchema = {};
         let roleBasedHtmlFormSchemas = {};
         let roleBasedHtmlGridSchemas = {};      
         if (!options.excludeDates) {
            this.getDateColumns(fSchema);
         }
         if (!options.excludeOwner) {
            this.getOwnerColumns(fSchema);
         }
         //globals.defineGlobal('TEST', 'TEST123', false, false);
         Object.keys(fSchema).forEach((field) => {
               let htmlOnly = fSchema[field].html;
               delete fSchema[field].html;
               let dbOnly = fSchema[field].db;
               delete fSchema[field].db;
               let config = fSchema[field].config;
               delete fSchema[field].config;

               //set dbschema
               dbSchema[field] = fSchema[field];
               if (dbOnly && Object.keys(dbOnly).length > 0) {
                  console.log('........');
                  utils.cloneObject(dbOnly, dbSchema);
                  console.log('........', utils.cloneObject(dbOnly, dbSchema));
               }

               //html form schemas - role based
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