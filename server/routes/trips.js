import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import tripsCtrl from '../controllers/trips';
import expressJwt from 'express-jwt';
import config from '../../config/env';
import globals from '../utils/globals';
import utils from '../utils/util';

const router = express.Router();	// eslint-disable-line new-cap

//console.log('.....** ', tripsCtrl.currentModel);
router.route('/')
  /** GET /api/users - Get list of users */
  .get(expressJwt({ secret: config.jwtSecret }), tripsCtrl.currentModel.list)

  /** POST /api/users - Create new user */
  .post(expressJwt({ secret: config.jwtSecret }), tripsCtrl.currentModel.create);

  router.route('/form').get((req, res, next) => {
   //  var uid = req.params.uid,
   //      path = req.params[0] ? req.params[0] : 'index.html';
    res.sendfile('static/test.json', { root: './server' });
  });

  router.route('/formglobal').get((req, res, next) => {
   //  var uid = req.params.uid,
   //      path = req.params[0] ? req.params[0] : 'index.html';
    console.log('...', utils.setObjectProperty('name', {key: 1}).setObjectProperty('age', 20));
    return res.json({
      value: ''//globals.TEST
    });
  });

// router.route('/:userId')
//   /** GET /api/users/:userId - Get user */
//   .get(testCtrl.get);

//   /** PUT /api/users/:userId - Update user */
//   .put(validate(paramValidation.updateUser), userCtrl.update)

//   /** DELETE /api/users/:userId - Delete user */
//   .delete(userCtrl.remove);

/** Load user when API with userId route parameter is hit */
//router.param('userId', testCtrl.baseModel.load);

export default router;
