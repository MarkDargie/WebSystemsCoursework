import {mongoose} from '../db/mongoose';
import {passport} from 'passport';
import {utils} from '../lib/utils';
import {User} from '../db/models';

// Set router variable for express routes
const router = require('express').Router();

/**
 * GET: /users/protected
 * This route is used to verify the authentication of users and restrict access to protected application routes
 * NOTE: This will be used for Angular Profile Guards for client access restrictions
 * @name users/protected
 * @memberof module:routes/users
 * @param path Express Route Path
 * @param passport Utilises passport authenticate method to protect route
 * @returns Status 200 OK if request user is authenticated with passport & issued JWT
 */
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!"});
});

/**
 * POST: /users/login
 * This route is used to login users of the application using passport authentication & Issues JWT on success
 * @name users/login
 * @memberof module:routes/users
 * @param path Express Route Path
 * @param req Request will contain user email, password and secure code
 * @returns Route returns status 200 OK if sucess and issues JWT. Return status 401 otherwise.
 */
router.post('/login', (req, res) => {

    // user.findone

});


// Export Express Router
module.exports = router;