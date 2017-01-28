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
      let computedFieldSchemas = {};       
      this.filterSchema = () => {
         let fSchema = options.schema;
         let self = this;
         /** ID - is it coming default after add/edit */
         let dbSchema = {};
         if (!options.excludeDates) {
            self.getDateColumns(fSchema);
         }
         if (!options.excludeOwner) {
            self.getOwnerColumns(fSchema);
         }

         self.fieldServiceMap = {};//create a field to services map so that when processing a field, corresponding services schemas will be updated
         self.serviceSchemas = {};//temporary service schemas store (role & app based)
         self.serviceConfigs = utils.getServiceConfigs(options.collection);
         if (self.serviceConfigs && Object.keys(self.serviceConfigs).length > 0) {
            Object.keys(self.serviceConfigs).forEach((serviceName) => {
               let serviceConfig = self.serviceConfigs[serviceName];
               if (serviceConfig.schemaFields && serviceConfig.schemaFields.length > 0) {
                  serviceConfig.schemaFields.forEach((field) => {
                     if (!self.fieldServiceMap[field]) {
                        self.fieldServiceMap[field] = [];
                     } 
                     self.fieldServiceMap[field].push(serviceName);
                  });
                  if (serviceConfig.schemaOverrideFeilds) {
                     Object.keys(serviceConfig.schemaOverrideFeilds).forEach((field) => {
                        if (!self.fieldServiceMap[field]) {
                           self.fieldServiceMap[field] = [];
                        } 
                        self.fieldServiceMap[field].push(serviceName);
                     });
                  }
               }
            });
         }               

         let roleBasedSchemas = {};
         Object.keys(fSchema).forEach((field) => {               
            self.processField(self, field, fSchema[field], dbSchema, roleBasedSchemas);
         });
         //store these role based schemas into cache and return them via apis    
         cache.updateSchemaStore(roleBasedSchemas);

         if (self.serviceSchemas && Object.keys(self.serviceSchemas).length > 0) {
            //if services are present, execute prepare method
            Object.keys(self.serviceSchemas).forEach((serviceKey) => {
               //  console.log('serviceKey', serviceKey);
                let parts = serviceKey.split(constants.CONFIG_KEY_SEPERATOR);
                if (self.serviceConfigs[parts[parts.length - 1]].prepare) {
                  self.serviceConfigs[parts[parts.length - 1]].prepare(serviceKey, self.serviceSchemas[serviceKey], self.serviceConfigs[parts[parts.length - 1]]);
                }
            });
            // console.log('serviceSchemas', self.serviceSchemas);
            cache.updateSchemaStore(self.serviceSchemas);
         }
         return dbSchema;
      };            
      this.setFieldDetails = (self, field, fieldData, schemaObject) => {
         if (field.indexOf('.') > 0) {
            let fieldPathParts = field.split('.');
            let projection = schemaObject;
            for (let i = 0; i < fieldPathParts.length - 1; i++) {
               if (fieldPathParts[i].indexOf('[') === 0) { //array of objects
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
      this.processField = (self, field, fieldData, dbSchema, roleBasedSchemas) => {   
         // console.log('field', field);
         if ((fieldData instanceof Array) || (typeof fieldData === 'object' && typeof fieldData.type === 'undefined')) { //indicates a nested field
            if (fieldData instanceof Array) {
               Object.keys(fieldData[0]).forEach((nestedField) => {   
                  //for processing nested arrays
                  let parts = field.split('.');
                  parts[parts.length - 1] = `[${parts[parts.length - 1]}]`;
                  let formattedField = parts.join('.');

                  self.processField(self, `${formattedField}.${nestedField}`, fieldData[0][nestedField], dbSchema, roleBasedSchemas);
               });          
            } else {
               Object.keys(fieldData).forEach((nestedField) => {   
                  self.processField(self, `${field}.${nestedField}`, fieldData[nestedField], dbSchema, roleBasedSchemas);
               });
            }                      
            return;  
         }
         // console.log('field', field);

         let fieldParts = field.split('.');

         //set title if not exists
         if (typeof fieldData.title === 'undefined') {
            //camelcase to uppercase. step 1)insert a space before all caps. step 2)uppercase the first character
            if (fieldParts.length > 0) { //if parent path exists
               fieldData.title = fieldParts[fieldParts.length - 1].replace(/([A-Z])/g, ' $1').replace(/^./, (str) => { return str.toUpperCase(); });
            } else {
               fieldData.title = field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => { return str.toUpperCase(); });
            }                                  
         }
      
         let htmlOnly = fieldData.html;
         delete fieldData.html;
         let dbOnly = fieldData.db;
         delete fieldData.db;
         let config = fieldData.config;
         delete fieldData.config;

         //now fieldData contains the common properties for that field

         //set dbschema
         let fieldDBData = {};
         utils.cloneObject(fieldDBData, fieldData);//get the common props
         if (dbOnly && Object.keys(dbOnly).length > 0) {
            utils.cloneObject(dbOnly, fieldDBData);//attach the db specific
         }
         self.setFieldDetails(self, field, fieldDBData, dbSchema);
                  
         let stringifiedFieldSchema = {}; //stringified types, default values etc
         Object.keys(fieldData).forEach((key) => {
            if (typeof fieldData[key] === 'function') {
               stringifiedFieldSchema[key] = fieldData[key].name;
            } else if (fieldData[key] instanceof Array && fieldData[key].length > 0) {//type = [String] or Arrays  
                  stringifiedFieldSchema[key] = [];
                  fieldData[key].forEach((subEle) => {
                     if (typeof subEle === 'function') {
                        stringifiedFieldSchema[key].push(subEle.name);
                     } else {
                        stringifiedFieldSchema[key].push(subEle);
                     }
                  });                                               
            } else {
               stringifiedFieldSchema[key] = fieldData[key];
            }
         });

         Object.keys(cache.APP_CONFIG).forEach((appKey) => {// for each application
            Object.keys(cache.APP_CONFIG[appKey].ROLES).forEach((role) => {//for each role      
               //application key + role code + collection name
               let cacheKey = appKey + constants.CONFIG_KEY_SEPERATOR + cache.APP_CONFIG[appKey].ROLES[role].Code + constants.CONFIG_KEY_SEPERATOR + options.collection;
               let formKey = cacheKey + constants.CONFIG_KEY_SEPERATOR + constants.CONFIG_KEY_FORM_SUFFIX;
               let gridKey = cacheKey + constants.CONFIG_KEY_SEPERATOR + constants.CONFIG_KEY_GRID_SUFFIX;
               let dbKey = cacheKey + constants.CONFIG_KEY_SEPERATOR + constants.CONFIG_KEY_DB_SUFFIX;
               let serviceKey = (cacheKey + constants.CONFIG_KEY_SEPERATOR + constants.CONFIG_KEY_SERVICE_SUFFIX).toUpperCase();
               formKey = formKey.toUpperCase();
               gridKey = gridKey.toUpperCase();
               dbKey = dbKey.toUpperCase();
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
               let fieldFormData = {};
               utils.cloneObject(stringifiedFieldSchema, fieldFormData);//attach the common props                
               if (htmlOnly && Object.keys(htmlOnly).length > 0) {
                  utils.cloneObject(htmlOnly, fieldFormData);//attach the html specific
               }               
               if (currentRoleHtmlOnlyAttrs) {
                  //customization exists for this app, role & field combination 
                  utils.cloneObject(currentRoleHtmlOnlyAttrs, fieldFormData);
               }
               self.setFieldDetails(self, field, fieldFormData, roleBasedSchemas[formKey]);               

               //2. process grid attributes    
               let fieldGridData = {};                 
               if (options.gridAttributes && options.gridAttributes.length > 0) {//collect the grid attributes
                  // roleBasedSchemas[gridKey][field] = {};                  
                  options.gridAttributes.forEach((attr) => {
                     if (currentRoleHtmlOnlyAttrs && currentRoleHtmlOnlyAttrs[attr]) {//get from role based html specific
                        fieldGridData[attr] = currentRoleHtmlOnlyAttrs[attr];
                     } else if (htmlOnly && htmlOnly[attr]) {//get from general html specific
                        fieldGridData[attr] = htmlOnly[attr];
                     } else {//get from common attributes
                        fieldGridData[attr] = stringifiedFieldSchema[attr];
                     }                           
                  });
                  self.setFieldDetails(self, field, fieldGridData, roleBasedSchemas[gridKey]);
               }

               let matchingServiceField;
               if (self.fieldServiceMap[field] && self.fieldServiceMap[field].length > 0) {// if this field exists in any service
                  matchingServiceField = field;
               } else if (field.indexOf('.') > 0) { //to support normal & nested fields
                  let nestedPath = '';
                  for (let i = 0; i < fieldParts.length; i++) {
                     nestedPath += ((i > 0) ? '.' : '') + fieldParts[i].replace('[', '').replace(']', '');
                     if (self.fieldServiceMap[nestedPath] && self.fieldServiceMap[nestedPath].length > 0) {
                        matchingServiceField = nestedPath;
                        break;
                     }
                  }
               }
               
               if (matchingServiceField && self.fieldServiceMap[matchingServiceField] && self.fieldServiceMap[matchingServiceField].length > 0) {// if this field exists in any service
                  self.fieldServiceMap[matchingServiceField].forEach((serviceName) => { //get all the services which include this field
                     let serviceFieldConfig = {};
                     let serviceRoleBasedKey = serviceKey + constants.CONFIG_KEY_SEPERATOR + serviceName;
                     if (self.serviceConfigs[serviceName].type === 'grid' && fieldGridData && Object.keys(fieldGridData).length > 0) {       
                        utils.cloneObject(fieldGridData, serviceFieldConfig); //if grid, copy field data of grid 
                     } else { //if (self.serviceConfigs[serviceName].type === 'form') {
                        utils.cloneObject(fieldFormData, serviceFieldConfig); //if form/custom, copy field data of form                         
                     } 

                     if (self.serviceConfigs[serviceName].schemaOverrideFeilds && self.serviceConfigs[serviceName].schemaOverrideFeilds[matchingServiceField] && Object.keys(self.serviceConfigs[serviceName].schemaOverrideFeilds[matchingServiceField]).length > 0) {
                        // override customizations of the field defined at service level
                        utils.cloneObject(self.serviceConfigs[serviceName].schemaOverrideFeilds[matchingServiceField], serviceFieldConfig);
                     }
                     if (serviceRoleBasedKey) {
                        if (!self.serviceSchemas[serviceRoleBasedKey]) {
                           self.serviceSchemas[serviceRoleBasedKey] = {};
                        }
                        self.setFieldDetails(self, field, serviceFieldConfig, self.serviceSchemas[serviceRoleBasedKey]); 
                     }                                        
                  });
               } 

               //3. process role based dbschema into cache which can be used for validations on every form submits etc to validate data      
               let fieldRoleDBData = {};     
               utils.cloneObject(stringifiedFieldSchema, fieldRoleDBData);//attach the common props first       
               if (dbOnly && Object.keys(dbOnly).length > 0) {
                  utils.cloneObject(dbOnly, fieldRoleDBData);//now override db specific
               }
               if (currentRoleDBOnlyAttrs) {
                  //customization exists for this app, role & field combination 
                  utils.cloneObject(currentRoleDBOnlyAttrs, fieldRoleDBData);
               }     
               self.setFieldDetails(self, field, fieldRoleDBData, roleBasedSchemas[dbKey]);                                    
            });
         });
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
         schema.createdBy = {
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