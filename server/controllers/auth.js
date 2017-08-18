const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const utils = require('../utils/util');
let cache = require('../utils/cache');
const config = require('../../config/env');
const userModel = require('mongoose').model('Users');

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  let app = utils.getRequestOrigin(req.headers.origin);

  userModel.getByWhereWithFields({
     where : {
         userName: req.body.username,
         'security.password': req.body.password
         // status: 'Active'
     }
  }, {fields: ['_id', 'userName', 'firstName', 'lastName', 'profile.userType']}, (error, userRecord) => {
        if (userRecord) {
         const token = jwt.sign({
            username: userRecord.userName,
            _id: userRecord._id,
            role: userRecord.profile.userType,
            app: app
         }, config.jwtSecret);
         return res.json({
            token,
            user: {
               _id: userRecord._id,
               username: userRecord.userName,
               role: userRecord.profile.userType,
               name: `${userRecord.firstName} ${userRecord.lastName}`,
               menu: cache.APP_CONFIG[app.toUpperCase()].ROLES[userRecord.profile.userType.toUpperCase()].Menu
            }       
         });
      }
      const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED);
      return next(err);
  });
}

module.exports = { login };
