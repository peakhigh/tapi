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

/**
 * 1) create trips schema
 * 2) create apis for form, grid for trips
 * 3) use token in the apis to determine roles, application details  etc
 * 4) make these trips apis generic so that the same work for all other collections
 * 5) work on link columns
 * 6) add/ edit/ delete/ search apis (filters designed @frontend)
 * 7) search with multiple collections (link columns attached)
 * 8) validations @backend -> role based -> on operations like add/edit/delete -> on collections
 * 9) cache mechanism to store at once and serve at all requests
 * 10) user service for login, logout, userregistration, edit profile, change password, forgot password, etc
 * 11) complete TODOs
 * 
 * UI
 * 1) form plugin to draw form with validations
 * 2) grid plugin with api call to draw and custom filters designed @frontend, template based
 * 3) menu plugin
 * 4) draw multiple forms & grids on the page
 * 5) login, logout 
 * 6) website
 * 7) website design, content, domain, seo etc
 */
