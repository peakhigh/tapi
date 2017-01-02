import expressJwt from 'express-jwt';
import cache from '../utils/cache';
import config from '../../config/env';
import express from 'express';

export default class BaseRouter { 
   constructor(options) {
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
   }
}