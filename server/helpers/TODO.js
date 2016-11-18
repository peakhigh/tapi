/**
 *
 * TODO
 * 1) use redis(?)/another column in user_actions table
 * and store information of session(token) in it like
 *
 * token
 * appid, (restrict based on app)
 * userid, (restrict based on app)
 * userrole, (restrict based on role)
 * number of requests in last 10 mins, (cant download more)
 * last request time  (sense the inactivity to logout), maintain the same in the UI also
 *
 * when logout from the UI,  remove the entry of the token in th backend
 *
 * 2) read https://github.com/auth0/express-jwt and findout all the existing options in the library
 * learn JWT authentication
 * if timedout when calling if expired, reset the token (everything in our api ajax call)
 *
 */
