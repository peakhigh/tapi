const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
let globals = require('../utils/globals');
const utils = require('../utils/util');
let cache = require('../utils/cache');
const constants = require('../config/constants');
let ObjectID = require('mongodb').ObjectID;
let Schema = mongoose.Schema;

module.exports = class BaseSchema {
   constructor(options) {
      let computedFieldSchemas = {};
      this.filterSchema = () => {
         let fSchema = options.schema;
         let self = this;
         /** ID - is it coming default after add/edit */
         let dbSchema = {};
         let collectionSchemas = {};
         // if (!options.excludeDates) {
         //    self.getDateColumns(fSchema);
         // }
         if (!options.excludeOwner) {
            self.getOwnerColumns(fSchema);
         }
         //application key + role + collection name
         self.formKey = options.collection + constants.CONFIG_KEY_SEPERATOR + constants.CONFIG_KEY_FORM_SUFFIX;               
         self.gridKey = options.collection + constants.CONFIG_KEY_SEPERATOR + constants.CONFIG_KEY_GRID_SUFFIX;
         self.dbKey = options.collection + constants.CONFIG_KEY_SEPERATOR + constants.CONFIG_KEY_DB_SUFFIX;
         self.serviceKey = (options.collection + constants.CONFIG_KEY_SEPERATOR + constants.CONFIG_KEY_SERVICE_SUFFIX).toUpperCase();
         self.formKey = self.formKey.toUpperCase();
         self.gridKey = self.gridKey.toUpperCase();
         self.dbKey = self.dbKey.toUpperCase();
         collectionSchemas[self.formKey] = {};
         collectionSchemas[self.gridKey] = {};
         collectionSchemas[self.dbKey] = {};

         //field to arrays of service names
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
                     if (self.fieldServiceMap[field].indexOf(serviceName) < 0) {
                        self.fieldServiceMap[field].push(serviceName);
                     }
                  });
                  if (serviceConfig.schemaOverrideFeilds) {
                     Object.keys(serviceConfig.schemaOverrideFeilds).forEach((field) => {
                        if (!self.fieldServiceMap[field]) {
                           self.fieldServiceMap[field] = [];
                        }
                        if (self.fieldServiceMap[field].indexOf(serviceName) < 0) {
                           self.fieldServiceMap[field].push(serviceName);
                        }
                     });
                  }
               }
            });
         }

         Object.keys(fSchema).forEach((field) => {
            self.processField(self, field, fSchema[field], dbSchema, collectionSchemas);
         });

         let roleBasedSchemas = {};
         //for all collectionSchemas(grid, form, db) call prepare hooks (where we can update schemas based on app & role)
         Object.keys(cache.APP_CONFIG).forEach((appKey) => {// for each application
            Object.keys(cache.APP_CONFIG[appKey].ROLES).forEach((role) => {//for each role   
               let appRoleKeyPrefix = appKey + constants.CONFIG_KEY_SEPERATOR + cache.APP_CONFIG[appKey].ROLES[role].Code + constants.CONFIG_KEY_SEPERATOR;
               
               //process app & role based form schema
               self.invokePrepareHook(appRoleKeyPrefix + self.formKey, 'form', collectionSchemas[self.formKey], roleBasedSchemas);            
               //process app & role based grid schema
               self.invokePrepareHook(appRoleKeyPrefix + self.gridKey, 'grid', collectionSchemas[self.formKey], roleBasedSchemas);  
               //process app & role based db schema          
               self.invokePrepareHook(appRoleKeyPrefix + self.dbKey, 'db', collectionSchemas[self.formKey], roleBasedSchemas);            
            });
         });
         //store these role based schemas into cache and return them via apis    
         cache.updateSchemaStore(roleBasedSchemas);

         if (self.serviceSchemas && Object.keys(self.serviceSchemas).length > 0) {
            let roleBasedServiceSchemas = {};
            //for all serviceSchemas(grid, form, custom) call prepare hooks (where we can update schemas based on app & role)
            Object.keys(self.serviceSchemas).forEach((serviceKey) => {
               Object.keys(cache.APP_CONFIG).forEach((appKey) => {// for each application
                  Object.keys(cache.APP_CONFIG[appKey].ROLES).forEach((role) => {//for each role   
                     let appRoleKeyPrefix = appKey + constants.CONFIG_KEY_SEPERATOR + cache.APP_CONFIG[appKey].ROLES[role].Code + constants.CONFIG_KEY_SEPERATOR;
                     let currentKey = appRoleKeyPrefix + serviceKey;
                     //process app & role based service schema
                     roleBasedServiceSchemas[currentKey] = {};
                     //cone the currently prepared schema in to role-based and modify the role-based one
                     utils.cloneObject(self.serviceSchemas[serviceKey], roleBasedServiceSchemas[currentKey]);
                     //call prepare hook so that it helps to change the service schema based on role & app  
                     let parts = serviceKey.split(constants.CONFIG_KEY_SEPERATOR);
                     let serviceName = parts[parts.length - 1];
                     if (self.serviceConfigs[serviceName].prepare) {                  
                        self.serviceConfigs[serviceName].prepare(currentKey, roleBasedServiceSchemas[currentKey], self.serviceConfigs[serviceName]);
                     }
                  });
               });
            });
            cache.updateServiceSchemaStore(roleBasedServiceSchemas, self.serviceConfigs);
         }         
         return dbSchema;
      };
      this.invokePrepareHook = (currentKey, schemaType, schema, roleBasedSchemas) => {
         //process app & role based schema(based on schemaType =  form/grid/db)
         roleBasedSchemas[currentKey] = {};
         //cone the currently prepared schema in to role-based and modify the role-based one
         utils.cloneObject(schema, roleBasedSchemas[currentKey]);
         if (options.hooks && options.hooks[schemaType] && options.hooks[schemaType].prepare) {
            //call prepare hook so that it helps to change the schema based on role & app 
            options.hooks[schemaType].prepare(currentKey, roleBasedSchemas[currentKey], options);
         }
      }
      this.cloneHtmlAttributes = (source, destination, args) => {
         //in html, clone only one level. first clone form props, secondly clone grid props and finally clone the whole object
         if (source) {
            let sourceCopy = {};
            utils.cloneObject(source, sourceCopy);
            if (args.isForm && sourceCopy.form && !args.onlyGrid) {
               if (!destination.form) {
                  destination.form = {};
               }
               utils.cloneObject(sourceCopy.form, destination.form, {
                  dontCloneDeep: true
               });
               delete sourceCopy.form;
            }

            if (args.isGrid && sourceCopy.grid) {
               if (!destination.grid) {
                  destination.grid = {};
               }
               utils.cloneObject(sourceCopy.grid, destination.grid, {
                  dontCloneDeep: true
               });
               delete sourceCopy.grid;
            }

            if (!args.onlyGrid) {
               utils.cloneObject(sourceCopy, destination, {
                  dontCloneDeep: true
               });
            }
         }
      };      
      this.getFieldTitle = (field) => {
         let fieldParts = field.split('.');
         //camelcase to uppercase. step 1)insert a space before all caps. step 2)uppercase the first character
         if (fieldParts.length > 0) { //if parent path exists
            return fieldParts[fieldParts.length - 1].replace(/([A-Z])/g, ' $1').replace(/^./, (str) => { return str.toUpperCase(); });
         }
         return field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => { return str.toUpperCase(); });
      };
      this.setHtmlArrayField = (fieldData) => {//this is designed to work for alpaca plugin
         // let type = fieldData.type[0];
         // fieldData.type = 'array';
         // fieldData.items = {
         //    type: type.toLowerCase()
         // };
         let type = fieldData.type[0];
         fieldData.type = [type];
         return fieldData;
      };
      this.setFieldDetails = (self, field, fieldData, schemaObject, schemaType) => {
         // console.log(field, schemaType);
         if (field.indexOf('.') > 0) {
            let fieldPathParts = field.split('.');
            let projection = schemaObject;
            for (let i = 0; i < fieldPathParts.length - 1; i++) {
               if (fieldPathParts[i].indexOf('[') === 0) { //array of objects
                  fieldPathParts[i] = fieldPathParts[i].replace('[', '').replace(']', '');
                  if (!projection[fieldPathParts[i]]) {
                     // if (schemaType === 'form') {//this is designed to work for alpaca plugin
                     //    projection[fieldPathParts[i]] = {
                     //       title: self.getFieldTitle(fieldPathParts[i]),
                     //       type: 'array',
                     //       items: {
                     //          type: 'object',
                     //          properties: {}
                     //       }
                     //    };
                     // } else {
                        projection[fieldPathParts[i]] = [{}];
                     // }
                  }
                  // if (schemaType === 'form') {
                  //    projection = projection[fieldPathParts[i]].items.properties;
                  // } else {
                     projection = projection[fieldPathParts[i]][0];
                  // }
               } else {
                  if (!projection[fieldPathParts[i]]) {
                     // if (schemaType === 'form') {//this is designed to work for alpaca plugin
                     //    projection[fieldPathParts[i]] = {
                     //       title: self.getFieldTitle(fieldPathParts[i]),
                     //       type: 'object',
                     //       properties: {}
                     //    };
                     // } else {
                        projection[fieldPathParts[i]] = {};
                     // }
                  }
                  // if (schemaType === 'form') {
                  //    projection = projection[fieldPathParts[i]].properties;
                  // } else {
                     projection = projection[fieldPathParts[i]];
                  // }
               }
            }
            projection[fieldPathParts[fieldPathParts.length - 1]] = fieldData;
            if (schemaType === 'form' && projection[fieldPathParts[fieldPathParts.length - 1]].type) {//this is designed to work for alpaca plugin
               if (typeof projection[fieldPathParts[fieldPathParts.length - 1]].type === 'string') {
                  projection[fieldPathParts[fieldPathParts.length - 1]].type = projection[fieldPathParts[fieldPathParts.length - 1]].type.toLowerCase();
               } else if (Array.isArray(projection[fieldPathParts[fieldPathParts.length - 1]].type)) {
                  self.setHtmlArrayField(projection[fieldPathParts[fieldPathParts.length - 1]]);
               }
            }
         } else {
            schemaObject[field] = fieldData;
            // console.log(typeof fieldData.type);
            if (schemaType === 'form' && schemaObject[field].type) {//this is designed to work for alpaca plugin
               if (typeof schemaObject[field].type === 'string') {
                  schemaObject[field].type = schemaObject[field].type.toLowerCase();
               } else if (Array.isArray(schemaObject[field].type)) {
                  self.setHtmlArrayField(schemaObject[field]);
               }
            }
         }
      };
      this.processField = (self, field, fieldData, dbSchema, collectionSchemas) => {
         // console.log('field', field);
         if ((fieldData instanceof Array) || (typeof fieldData === 'object' && typeof fieldData.type === 'undefined')) { //indicates a nested field
            if (fieldData instanceof Array) {
               Object.keys(fieldData[0]).forEach((nestedField) => {
                  //for processing nested arrays
                  let parts = field.split('.');
                  parts[parts.length - 1] = `[${parts[parts.length - 1]}]`;
                  let formattedField = parts.join('.');
                  self.processField(self, `${formattedField}.${nestedField}`, fieldData[0][nestedField], dbSchema, collectionSchemas);
               });
            } else {
               Object.keys(fieldData).forEach((nestedField) => {
                  self.processField(self, `${field}.${nestedField}`, fieldData[nestedField], dbSchema, collectionSchemas);
               });
            }
            return;
         }
         let fieldParts = field.split('.');

         //set title if not exists
         if (typeof fieldData.title === 'undefined') {
            fieldData.title = self.getFieldTitle(field);
         }

         let htmlOnly = fieldData.html;
         delete fieldData.html;
         let dbOnly = fieldData.db;
         delete fieldData.db;
         let fieldPath = field.replace(/\[/g, '').replace(/\]/g, '');

         //set dbschema
         let fieldDBData = {};
         utils.cloneObject(fieldDBData, fieldData);//get the common props
         if (dbOnly && Object.keys(dbOnly).length > 0) {
            utils.cloneObject(dbOnly, fieldDBData);//attach the db specific
         }
         self.setFieldDetails(self, field, fieldDBData, dbSchema);

         let stringifiedFieldSchema = {}; //stringified types, default values etc
         Object.keys(fieldData).forEach((key) => {
            if (typeof fieldData[key] === 'function') {//for types
               stringifiedFieldSchema[key] = fieldData[key].name.replace('Schema','');              
            } else if (fieldData[key] instanceof Array && fieldData[key].length > 0) {//type = [String] or Arrays  
               stringifiedFieldSchema[key] = [];
               fieldData[key].forEach((subEle) => {
                  if (typeof subEle === 'function') {
                     stringifiedFieldSchema[key].push(subEle.name.replace('Schema',''));
                  } else {
                     stringifiedFieldSchema[key].push(subEle);
                  }
               });
            } else {
               stringifiedFieldSchema[key] = fieldData[key];
            }
         });
         //create schemas for form & grid for this collection
         let exposeInForm = true;
         let exposeInGrid = true;
         if (options.dontExpose && options.dontExpose.formFields && options.dontExpose.formFields.length > 0) {  
            if (options.dontExpose.formFields.indexOf(fieldPath) >= 0) {
               exposeInForm = false;
            }
            if (options.dontExpose.manageFields.indexOf(fieldPath) >= 0) {
               exposeInGrid = false;
            }
         }        
         //1. process form attributes               
         let fieldFormData = {};
         if (exposeInForm) {
            utils.cloneObject(stringifiedFieldSchema, fieldFormData);//attach the common props                
            if (htmlOnly && Object.keys(htmlOnly).length > 0) {                     
               // utils.cloneObject(htmlOnly, fieldFormData);//attach the html specific
               self.cloneHtmlAttributes(htmlOnly, fieldFormData, {isForm: true});
            }
            self.setFieldDetails(self, field, fieldFormData, collectionSchemas[self.formKey], 'form');      
         }               
         //2. process grid attributes    
         let fieldGridData = {};
         if (exposeInGrid && options.gridAttributes && options.gridAttributes.length > 0) {//collect the grid attributes
            options.gridAttributes.forEach((attr) => {
               if (htmlOnly && htmlOnly[attr]) {//get from general html specific
                  fieldGridData[attr] = htmlOnly[attr];
               } else {//get from common attributes
                  fieldGridData[attr] = stringifiedFieldSchema[attr];
               }
            });
            //clone html.grid properties
            self.cloneHtmlAttributes(stringifiedFieldSchema, fieldGridData, {isGrid: true, onlyGrid: true});
            self.cloneHtmlAttributes(htmlOnly, fieldGridData, {isGrid: true, onlyGrid: true});

            self.setFieldDetails(self, field, fieldGridData, collectionSchemas[self.gridKey]);
         }

         //process service fields/ override service config of fields
         let matchingServiceFields = [];
         if (self.fieldServiceMap[field] && self.fieldServiceMap[field].length > 0) {// if this field exists in any service
            matchingServiceFields.push(field);
         } else if (field.indexOf('.') > 0) { //to support normal & nested fields
            let nestedPath = '';
            for (let i = 0; i < fieldParts.length; i++) {
               nestedPath += ((i > 0) ? '.' : '') + fieldParts[i].replace('[', '').replace(']', '');
               if (self.fieldServiceMap[nestedPath] && self.fieldServiceMap[nestedPath].length > 0) {
                  matchingServiceFields.push(nestedPath);
               }
            }
         }

         if (matchingServiceFields && matchingServiceFields.length > 0) {// if this field exists in any service
            matchingServiceFields.forEach((matchingServiceField) => {
               self.fieldServiceMap[matchingServiceField].forEach((serviceName) => { //get all the services which include this field
                  if (self.serviceConfigs[serviceName].type === 'grid' && !exposeInGrid) {
                     return; //respect the dontExpose setting at schema level
                  }
                  if (self.serviceConfigs[serviceName].type === 'form' && !exposeInForm) {
                     return; //respect the dontExpose setting at schema level
                  }
                  let currentServiceKey = self.serviceKey + constants.CONFIG_KEY_SEPERATOR + serviceName;                        
                  let serviceFieldConfig = {};
                  if (self.serviceConfigs[serviceName].type === 'grid' && fieldGridData && Object.keys(fieldGridData).length > 0) {
                     utils.cloneObject(fieldGridData, serviceFieldConfig); //if grid, copy field data of grid 
                  } else { //if (self.serviceConfigs[serviceName].type === 'form') {
                     utils.cloneObject(fieldFormData, serviceFieldConfig); //if form/custom, copy field data of form                         
                  }

                  if (self.serviceConfigs[serviceName].schemaOverrideFeilds && self.serviceConfigs[serviceName].schemaOverrideFeilds[matchingServiceField] && Object.keys(self.serviceConfigs[serviceName].schemaOverrideFeilds[matchingServiceField]).length > 0) {
                     // override customizations of the field defined at service level
                     // utils.cloneObject(self.serviceConfigs[serviceName].schemaOverrideFeilds[matchingServiceField], serviceFieldConfig);
                     self.cloneHtmlAttributes(self.serviceConfigs[serviceName].schemaOverrideFeilds[matchingServiceField], serviceFieldConfig, {isGrid: true, isForm: true});
                  }
                  if (!self.serviceSchemas[currentServiceKey]) {
                     self.serviceSchemas[currentServiceKey] = {};
                  }
                  self.setFieldDetails(self, field, serviceFieldConfig, self.serviceSchemas[currentServiceKey], 'form');
               });
            });
         }
         //3. process role based dbschema into cache which can be used for validations on every form submits etc to validate data 
         let fieldCacheDBData = {};//which we store in cache
         utils.cloneObject(stringifiedFieldSchema, fieldCacheDBData);//attach the common props first  
         if (dbOnly && Object.keys(dbOnly).length > 0) {
            utils.cloneObject(dbOnly, fieldCacheDBData);//now override db specific
         }  
         self.setFieldDetails(self, field, fieldCacheDBData, collectionSchemas[self.dbKey]);
      };
      this.attachHooks = () => {
         /**
         * Add your
         * - pre-save hooks
         * - validations
         * - virtuals
         */
         this.schema.pre('update', (next) => {//for all schemas           
            console.log('....pre update');
            next();
         });
         this.schema.pre('insert', (next) => {//for all schemas           
            console.log('....pre insert');
            next();
         });
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
            listFields(query, extraOptions, cb) {//select few fields only
               if (!extraOptions.selectFields) {
                  extraOptions.selectFields = [];
               }
               if (extraOptions.selectFields.indexOf('_id') < 0) {
                  extraOptions.selectFields.push('_id');
               }
               console.log(query);
               this.count(query.where || {}).execAsync().then((total) => {
                  if (total === 0) {
                     if (extraOptions.response) {
                        extraOptions.response.data = [];
                        extraOptions.response.total = 0;
                        return cb(null, extraOptions.response);
                     }
                     return cb(null, {
                        data: [],
                        total: 0
                     }); 
                  }
                  this.find(query.where ? JSON.parse(query.where) : {}, extraOptions.selectFields.join(' '))
                  .sort(((query.sort && Object.keys(query.sort).length > 0) ? query.sort : { createdAt: -1 }))
                  .skip((query.skip ? parseInt(query.skip, 10) : 0))
                  .limit((query.limit ? parseInt(query.limit, 10) : constants.DEFAULT_PAGE_SIZE))
                  .execAsync().then((data) => {
                     if (extraOptions.response) {
                        extraOptions.response.data = data;
                        extraOptions.response.total = total;
                        return cb(null, extraOptions.response);
                     }
                     return cb(null, {
                        data: data,
                        total: total
                     });              
                  });
               });               
            },  
            list(query, extraOptions, cb) {//all fields               
               this.find(query.where ? JSON.parse(query.where) : {})
                  .sort((query.sort ? JSON.parse(query.sort) : { createdAt: -1 }))
                  .skip((query.skip ? parseInt(query.skip, 10) : 0))
                  .limit((query.limit ? parseInt(query.limit, 10) : constants.DEFAULT_PAGE_SIZE))
                  .execAsync().then((data) => {
                     if (data) {
                        if (extraOptions.response) {
                           extraOptions.response.data = data;
                           return cb(null, extraOptions.response);
                        }
                        return cb(null, data);
                     }
                     return cb(null, data);
                  });
            },
            editById(data, extraOptions, cb) {
               console.log('update callback');
               let model = this;
               let _id = data._id;
               console.log(JSON.stringify(data));
               delete data._id;               
               this.update({_id: _id}, data, (err, result) => { 
                  console.log(err, result);
                  if (err) {
                     return cb(err, {success: false, _id: data._id, error: err});
                  }
                  return cb(err, {success: true, _id: result._id});
               });
            },
            addOrEdit(data, extraOptions, cb) {
               console.log('addOrEditByRequest callback');
               let model = this;
               // if (req.body._id) {//update
                  // this.findById(req.body._id)
                  // .lean().execAsync().then((record) => {
                  //    if (record) {
                  //       let doc = new model(record);
                  //       doc.isNew = false;
                  //       return doc.save(req.body, (err) => {
                  //          if (err) {
                  //             console.log(err);
                  //             return cb(err, { success: false, _id: req.body._id, err: err });
                  //          }
                  //          return cb(err, { success: true, _id: req.body._id });
                  //       });
                  //    }
                  //    const err = new APIError('No such record exists!', httpStatus.NOT_FOUND);
                  //    return cb(err, { success: false, _id: req.body._id, err: err });
                  // });

                  // let instance = new this();
                  // instance.init(req.body, {}, (e) => {
                  //    console.log(e);
                  //    instance.save((err) => { 
                  //       if (err) {
                  //          console.log(err);
                  //          return cb(err, { success: false, _id: req.body._id, err: err });
                  //       }
                  //       return cb(err, { success: true, _id: req.body._id });
                  //    });
                  // });


                  // req.body._id = mongoose.Types.ObjectId(req.body._id);
                  // // console.log(req.body);
                  // let doc = new this({_id: req.body._id});
                  // // delete req.body._id;
                  // // doc._id = mongoose.Types.ObjectId(req.body._id);
                  // doc.isNew = false;
                  // doc.save(req.body, (err) => {
                  //    if (err) {
                  //       console.log(err);
                  //       return cb(err, { success: false, _id: req.body._id, err: err });
                  //    }
                  //    return cb(err, { success: true, _id: req.body._id });
                  // });
               // } else {//insert
               //    let doc = new this(req.body);
               //    doc.save((err) => {
               //       if (err) {
               //          console.log(err);
               //          return cb(err, { success: false, _id: req.body._id, err: err });
               //       }
               //       return cb(err, { success: true, _id: req.body._id });
               //    });
               // }

               // let _id = req.body._id || new ObjectID();
               // if (!req.body._id) {
               //    req.body._id = new ObjectID();
               // }
               // console.log();
               // let doc = new this(req.body);
               // doc.save((err) => {
               //    if (err) {
               //       return cb(err, { success: false, _id: req.body._id, err: err });
               //    }
               //    return cb(err, { success: true, _id: req.body._id });
               // });

               // let _id = req.body._id || new ObjectID();
               // delete req.body._id;
               // // console.log(req.body);
               // // this.update({_id: _id}, { $set: req.body}, { upsert: true }, (err, result) => { 
               // this.update({_id: _id}, req.body, { upsert: true }, (err, result) => { 
               //    console.log(err, result);
               //    if (result.n && result.upserted && result.upserted.length > 0 && result.upserted[0]._id) {//inserted
               //       return cb(err, {success: true, _id: result.upserted[0]._id}); 
               //    } else if (result.nModified) {//updated
               //       return cb(err, {success: true, _id: _id});
               //    }                                 
               //    return cb(err, {success: false, _id: req.body._id, error: err});              
               // });  
               let _id = data._id || new ObjectID();
               delete data._id;                              
               console.log(data);
               this.findOneAndUpdate({_id: _id}, data, {upsert: true, fields: {_id: 1}, new: true, runValidators: true}, (err, result) => { 
                  console.log(err, result);
                  if (err) {
                     return cb(err, {success: false, _id: data._id, error: err});
                  }
                  return cb(err, {success: true, _id: result._id});
         
                  // if (result.n && result.upserted && result.upserted.length > 0 && result.upserted[0]._id) {//inserted
                  //    return cb(err, {success: true, _id: result.upserted[0]._id}); 
                  // } else if (result.nModified) {//updated
                  // }                                 
                  //   
               });
            },
            getById(params, extraOptions, cb) {
               console.log('getById callback');
               // this.findById(req.params.id).lean().exec((err, doc) => {
               //    if (err) {
               //       return cb(err, null);
               //    }
               //    if (extraOptions.response) {
               //       extraOptions.response.data = doc;
               //       return cb(null, extraOptions.response);
               //    } 
               //    return cb(null, doc);
               // });              
               this.findById(params.id)
                  .lean().execAsync().then((record) => {
                     if (record) {
                        if (extraOptions.response) {
                           extraOptions.response.data = record;
                           return cb(null, extraOptions.response);
                        }
                        return cb(null, record);
                     }
                     const err = new APIError('No such record exists!', httpStatus.NOT_FOUND);
                     return cb(err, null);
                  });
            },
            getByIdWithFields(params, extraOptions, cb) {              
               this.findById(params.id).select(extraOptions.fields)
                  .lean().execAsync().then((record) => {
                     if (record) {
                        if (extraOptions.response) {
                           extraOptions.response.data = record;
                           return cb(null, extraOptions.response);
                        }
                        return cb(null, record);
                     }
                     const err = new APIError('No such record exists!', httpStatus.NOT_FOUND);
                     return cb(err, null);
                  });
            },
            getByWhereWithFields(params, extraOptions, cb) {              
               this.findOne(params.where).select(extraOptions.fields)
                  .lean().execAsync().then((record) => {
                     if (record) {
                        if (extraOptions.response) {
                           extraOptions.response.data = record;
                           return cb(null, extraOptions.response);
                        }
                        return cb(null, record);
                     }
                     const err = new APIError('No such record exists!', httpStatus.NOT_FOUND);
                     return cb(err, null);
                  });
            }
         };
      };
      this.getOwnerColumns = (schema) => {
         schema.createdBy = {
            type: Schema.Types.ObjectId
         };
         schema.updatedBy = {
            type: Schema.Types.ObjectId
         };
      };
      // this.getDateColumns = (schema) => {
      //    schema.createdAt = {
      //       type: Date,  
      //       required: true,    
      //       default: Date.now 
      //    };
      //    schema.updatedAt = {
      //       type: Date,
      //       required: true,
      //       default: Date.now           
      //    };
      // };

      this.schema = new mongoose.Schema(this.filterSchema(), { timestamps: !options.excludeDates });
      this.attachHooks();
      this.attachMethods();
      this.attachStatics();

      console.log('Creating model', options.collection);
      this.getSchema = () => { return mongoose.model(options.collection, this.schema); };
   }
};