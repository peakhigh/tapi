import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import utils from '../utils/util';
import cache from '../utils/cache';

const config = require('../../config/env');

// sample user, used for authentication
const callcenterUser = {
  username: 'callcenter',
  password: '12345',
  role: 'CALL_CENTER_USER',
  firstName: 'Call',
  lastName: 'Center'
};

const truckUser = {
  username: 'trip',
  password: '12345',
  role: 'TRUCK_USER',
  firstName: 'Truck',
  lastName: 'User'
};

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  /** TODO: read from DB */
  let userRecord;
  if (req.body.username === callcenterUser.username && req.body.password === callcenterUser.password) {
     userRecord = callcenterUser;
  } else if (req.body.username === truckUser.username && req.body.password === truckUser.password) {
     userRecord = truckUser;
  }
  let app = utils.getRequestOrigin(req.headers.origin);

  if (userRecord) {
    const token = jwt.sign({
      username: userRecord.username,
      role: userRecord.role,
      app: app
    }, config.jwtSecret);
    return res.json({
      token,
      user: {
         username: userRecord.username,
         role: userRecord.role,
         name: `${userRecord.firstName} ${userRecord.lastName}`,
         menu: cache.APP_CONFIG[app.toUpperCase()].ROLES[userRecord.role.toUpperCase()].Menu
      }       
    });
  }

  const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED);
  return next(err);
}

export default { login };
