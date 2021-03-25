const {mongoose} = require('../db/mongoose');
const router = require('express').Router(); 
const passport = require('passport');
const utils = require('../lib/utils');

const {User, Method} = require('../db/models');

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

router.get('/admin', (req, res, next) => {
    
    User.findOne({username: req.body.username, access: "admin"}).then((user)=>{
        if(user){ res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!"});}
        else { res.status(402).json({ success: false, msg: "You are  not authenticated to this route!"});;}
    });

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

    console.log("LOGIN ROUTE CALLED", req.body.username, req.body.password);

    User.findOne({ username: req.body.username })
    .then((user) => {

        if (!user) {
            res.status(401).json({ success: false, msg: "could not find user" });
        }
        
        console.log(user);

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
        username: req.body.username,
        securecode: req.body.securecode,
        balance: 1000,
        access: "general",
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

router.post('/paymentmethod', (req, res, next) =>{

    const name = req.body.name;
    const cardnumber = utils.hashDetails(req.body.card);
    const address = utils.hashDetails(req.body.address);
    const holder = utils.hashDetails(req.body.holder);
    const cvv = utils.hashDetails(req.body.cvv);
    const expdate = utils.hashDetails(req.body.expdate);

    const method = new Method({
        name: name,
        number: cardnumber,
        address: address,
        holder: holder,
        cvv: cvv,
        expdate: expdate
    });

    User.findOne({ username: req.body.username })
    .then((user) => {

        if (!user) {
            res.status(401).json({ success: false, msg: "could not find user" });
        }
        
        User.findOneAndUpdate({username: req.body.username}, {$push: {paymentmethods: method}}, (error, response)=>{
            if(error) res.sendStatus(404);
            console.log(response);
            res.send(response);
        });


    })
    .catch((err) => {
        next(err);
    });


});

// get passport authenticatd users profile
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    console.log("profile route hit");
    res.send(req.user);
});

//delete user
router.post('/remove', passport.authenticate('jwt', {session: false}), (req, res) => {

    User.findOneAndRemove({username: req.body.username})
    .then((user)=>{
        
        if (!user) {
            res.status(401).json({ success: false, msg: "could not find user" });
        }

        res.sendStatus(200);
    });

});


// Export Express Router
module.exports = router;