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
 * 1) create trips schema - created trucks - done
 * 1.1) nested schemas - done
 * 2) create apis for form, grid for trips - done
 * 3) use token in the apis to determine roles, application details  etc - done
 * 4) make these trips apis generic so that the same work for all other collections - done
 * 5) work on link columns
 * 6) add/ edit/ delete/ search apis (filters designed @frontend)
 * 7) search with multiple collections (link columns attached)
 * 8) validations @backend -> role based -> on operations like add/edit/delete -> on collections
 * 9) cache mechanism to store at once and serve at all requests
 * 10) user service for login, logout, userregistration, edit profile, change password, forgot password, etc
 * 11) complete TODOs
 * 12) Use multiple Mongo connections (for userstore & trips_trucks seperately)
 * 13) like odin, use multiple hosts & passport for user schema & authentication
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


/**
 * Server:
 * Do required validatins at server side by geting request.body json
 * Do rest of validatiosns by mongoose by default (no need to do anything fancy at save but need to define valtaions at schema level)
 * set unique, email, phone etc validations by match property
 * set createdAt, createdBy such feilds in service before save
 * insert/edit service with edit data population
 * basic get service 
 * link columns
 * advaned get service
 * deprecated mongoose libarary
 * after insert - return id, after edit return id in responses
 * Attach Pre save/update/insert etc, post save/update/insert hooks
 * addOrEdit - set owner columns (using setonInsert & set from request token, firstly send userid in the token)
 * 
 * UI:
 * grid control
 */