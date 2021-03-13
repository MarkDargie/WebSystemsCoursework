const {mongoose} = require('../db/mongoose');
const router = require('express').Router(); 
const passport = require('passport');
const utils = require('../lib/utils');

const {User} = require('../db/models');

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
router.post('/login', (req, res, next) => {

    User.findOne({ email: req.body.email })
    .then((user) => {

        if (!user) {
            res.status(401).json({ success: false, msg: "could not find user" });
        }
        
        // Function defined at bottom of app.js
        const isValid = utils.validPassword(req.body.password, user.hash, user.salt);
        
        if (isValid) {

            const tokenObject = utils.issueJWT(user);

            res.status(200).json({ success: true, token: tokenObject.token, expiresIn: tokenObject.expires });

        } else {

            res.status(401).json({ success: false, msg: "you entered the wrong password" });

        }

    })
    .catch((err) => {
        next(err);
    });

});

//Register a new user
router.post('/register', function(req, res, next){

    console.log("REGISTER ROUTE CALLED");
    const saltHash = utils.genPassword(req.body.password);
    
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        email: req.body.email,
        hash: hash,
        salt: salt
    });

    try {
    
        newUser.save()
            .then((user) => {
                res.json({ success: true, user: user });
            });

    } catch (err) {
        
        res.json({ success: false, msg: err });
    
    }

});


// Export Express Router
module.exports = router;