const expressJwt = require('express-jwt');
const utils = require('../utils/util');
let cache = require('../utils/cache');
const httpUtils = require('../utils/http');
const config = require('../../config/env');
const express = require('express');
const fs = require('fs');
const path = require('path');

function processServiceRequestCallback(req, res, next, serviceConfig, httpMethod, options, validateOutput) {
   let schema;
   if (httpMethod === 'get') {
      schema = cache.getRequestServiceSchema(req);
   }
   if (serviceConfig[httpMethod] && serviceConfig[httpMethod].callback) {//on validate success, if callback present
      // let schema = cache.getRequestServiceSchema(req);
      let args = [serviceConfig, req, options, (err, out) => {
         if (err) {
            if (out) {//if out present on error, return ouput considering it as json response
               return res.json(out);
            }
            return res.json(httpUtils.httpError(req, (err && err.message) ? err.message : 'Invalid Request'));
         }
         //send response
         return res.json(out);
      }];
      if (httpMethod === 'get') {
         args.unshift(schema);
      }
      serviceConfig[httpMethod].callback.apply(this, args);
   } else {
      return res.json(schema || { success: true });//callback not defined  
   }
}

function processServiceRequest(req, res, next, serviceConfig, httpMethod, options) {
   if (serviceConfig[httpMethod] && serviceConfig[httpMethod].preValidate) {//validate the request
      let args = [serviceConfig, req, options, (err, out) => {
         if (err) {//on error                              
            if (out) {//if out present on error, return ouput considering it as json response
               return res.json(out);
            }
            return res.json(httpUtils.httpError(req, (err && err.message) ? err.message : 'Invalid Request'));
         }
         processServiceRequestCallback(req, res, next, serviceConfig, httpMethod, options, out);//process callback         
      }];
      // if (httpMethod === 'get') {
      //    args.unshift(cache.getRequestServiceSchema(req));
      // }
      serviceConfig[httpMethod].preValidate.apply(this, args);
   } else {
      processServiceRequestCallback(req, res, next, serviceConfig, httpMethod, options, null); //process callback                    
   }
}

module.exports = class BaseRouter {
   constructor(options) {
      let self = this;
      this.router = express.Router();

      this.router.route('/')
         /** GET - Get list of current collection documents */
         .get(expressJwt({ secret: config.jwtSecret }), options.controller.currentModel.list)

         /** POST - Create new document of current collection */
         .post(expressJwt({ secret: config.jwtSecret }), options.controller.currentModel.create);

      /** TODO: complete add/edit/delete/search */

      /** get /form - return form schema of current collection */
      this.router.route('/form').get(expressJwt({ secret: config.jwtSecret }), (req, res, next) => {
         return res.json(cache.getRequestSchema(req));
      });

      /** get /grid - return grid schema of current collection */
      this.router.route('/grid').get(expressJwt({ secret: config.jwtSecret }), (req, res, next) => {
         return res.json(cache.getRequestSchema(req));
      });

      /** get /db - return db schema of current collection -- only testing purpose */
      this.router.route('/db').get(expressJwt({ secret: config.jwtSecret }), (req, res, next) => {
         return res.json(cache.getRequestSchema(req));
      });

      if (options.collection) {
         let serviceConfigs = utils.getServiceConfigs(options.collection);
         if (serviceConfigs && Object.keys(serviceConfigs).length > 0) {
            Object.keys(serviceConfigs).forEach((serviceName) => {
               /** get /service/service_name - return service schema */
               // console.log(`mounting service --> /service/${serviceConfigs[serviceName].type}/${serviceName}`);
               console.log(`mounting service --> /service/${serviceName}`);
               let serviceConfig = serviceConfigs[serviceName];
               self.router.route(`/service/${serviceName}`)[serviceConfig.requestType ? serviceConfig.requestType.toLowerCase() : 'get'](expressJwt({ secret: config.jwtSecret }), (req, res, next) => {
                  processServiceRequest(req, res, next, serviceConfig, 'get');
               });
               if (serviceConfig.type === 'form') {
                  console.log(`mounting service --> /service/${serviceName}/:id`);
                  self.router.route(`/service/${serviceName}/:id`)[serviceConfig.requestType ? serviceConfig.requestType.toLowerCase() : 'get'](expressJwt({ secret: config.jwtSecret }), (req, res, next) => {
                     processServiceRequest(req, res, next, serviceConfig, 'get');
                  });
                  if (serviceConfig.post) {
                     console.log(`mounting service --> /service/${serviceName} --> post`);
                     self.router.route(`/service/${serviceName}`).post(expressJwt({ secret: config.jwtSecret }), (req, res, next) => {
                        processServiceRequest(req, res, next, serviceConfig, 'post');
                     });
                  }
               }
            });
         }
      }
   }
};