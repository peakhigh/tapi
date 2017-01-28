import expressJwt from 'express-jwt';
import utils from '../utils/util';
import cache from '../utils/cache';
import httpUtils from '../utils/http';
import config from '../../config/env';
import express from 'express';
const fs = require('fs');
const path = require('path');

export default class BaseRouter { 
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
                  if (serviceConfig.init) {
                     let out = serviceConfig.init(serviceConfig, req);
                     if (typeof out !== 'undefined' && out !== null) {
                        if (out.result === false) {
                           return res.json(httpUtils.httpError(req, out.message || 'Invalid Request'));
                        }
                        if (out.response) {
                           return res.json(out.response);
                        }
                     }                     
                  }    
                  let response = cache.getRequestServiceSchema(req);                                        
                  if (serviceConfig.callback) {
                     let out = serviceConfig.callback(response, serviceConfig, req);
                     if (out) {
                        response = out;
                     }                      
                  }
                  return res.json(response);    
               });
            });
         }
      }
   }
}