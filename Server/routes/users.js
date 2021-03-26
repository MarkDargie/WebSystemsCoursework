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
 * @memberof routes/users
 * @param path Express Route Path
 * @param passport Utilises passport authenticate method to protect route
 * @returns Status 200 OK if request user is authenticated with passport & issued JWT
 */
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!"});
});

/**
 * GET: /users/admin
 * This route is used to verify the authentication of admin users and restrict access to protected admin components.
 * NOTE: This will be used for Angular Profile Guards for client access restrictions
 * @name users/admin
 * @memberof routes/users
 * @param path Express Route Path
 * @param passport Utilises passport authenticate method to protect route
 * @returns Status 200 OK if request user has admin access with passport & issued JWT
 */
router.get('/admin', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    
    User.findOne({username: req.user.username, access: "admin"}).then((user)=>{
        if(user){ res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!"});}
        else { res.status(401).json({ success: false, msg: "You are  not authenticated to this route!"});;}
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
    User.findOne({ username: req.body.username })
    .then((user) => {
        if (!user) {
            res.status(401).json({ success: false, msg: "could not find user" });
        }

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

/**
 * POST: /users/register
 * This route is used to register users to the system with Hashed password values.
 * @name users/register
 * @memberof routes/users
 * @param path Express Route Path
 * @param req Request will contain user registeration fields
 * @returns Route returns status 201 OK if sucess and created user. Return status 400 otherwise.
 */
router.post('/register', function(req, res, next){

    // Setting User Password Fields with Utils Encryption Methods
    const saltHash = utils.genPassword(req.body.password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    // Setting New User Schema to be registered
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
                res.status(201).json({ success: true, user: user });
            });

    } catch (err) {
        
        res.status(400).json({ success: false, msg: err });
    }

});

/**
 * POST: /users/paymentmethod
 * This route is used to create user payment method objects
 * @name users/paymentmethod
 * @memberof routes/users
 * @param path Express Route Path
 * @param req Request will contain payment method fields
 * @returns Route returns status 200 OK if sucess and create method. Return status 400 otherwise.
 */
router.post('/paymentmethod', passport.authenticate('jwt', { session: false }), (req, res, next) =>{

    // Set Variables from Req body
    const name = req.body.name;
    const cardnumber = utils.hashDetails(req.body.card);
    const address = utils.hashDetails(req.body.address);
    const holder = utils.hashDetails(req.body.holder);
    const cvv = utils.hashDetails(req.body.cvv);

    // Create Method Object
    const method = new Method({
        name: name,
        number: cardnumber,
        address: address,
        holder: holder,
        cvv: cvv
    });

    User.findOne({ username: req.user.username })
    .then((user) => {

        if (!user) {
            res.status(400).json({ success: false, msg: "could not find user" });
        }
        
        User.findOneAndUpdate({username: req.user.username}, {$push: {paymentmethods: method}}, (error, response)=>{
            if(error) res.status(404);
            console.log(response);
            res.status(200).json({ success: true, msg: "Card Added" });
        });


    })
    .catch((err) => {
        next(err);
    });


});

/**
 * GET: /users/profile
 * This route is used to get and return authenticated user account details
 * @name users/profile
 * @memberof routes/users
 * @param path Express Route Path
 * @param req Request will contain user request issued by Passport Authentication
 * @returns Returns Authenticated users account details
 */
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.send(req.user);
});

/**
 * POST: /users/updatedetails
 * This route is used to update authenticated user account details
 * @name users/updatedetails
 * @memberof routes/users
 * @param path Express Route Path
 * @param req Request will contain user request issued by Passport Authentication & Details to update
 * @returns Returns Status 200 OK if complete.
 */
router.post('/updatedetails', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    try {
        User.findOneAndUpdate({username: req.user.username}, {username: req.body.username, email: req.body.email}).then((user)=>{
            res.status(200);
            res.send(user);
            user.save();
        });
    }
    catch(error){
        console.log(erorr);
    }
});

/**
 * POST: /users/updatesecurity
 * This route is used to update users password and re-hash the req value.
 * @name users/updatesecurity
 * @memberof routes/users
 * @param path Express Route Path
 * @param req Request will contain user request issued by Passport Authentication & Details to update
 * @returns Status 200 OK on success. return Status 400 otherwise.
 */
router.post('/updatesecurity', passport.authenticate('jwt', { session: false }), (req, res, next)=> {

    try{
        User.findOne({username: req.user.username}, function (err, user) {
            if(!user){
                res.status(400).json({ success: false, msg: "could not find user" });
            }
    
            // Validate Previous password with utils method
            const oldpassword = utils.validPassword(req.body.oldpassword, user.hash, user.salt);
    
            if(oldpassword){
    
                // If valid, Hash new password form user req
                const saltHash = utils.genPassword(req.body.newpassword);
                const salt = saltHash.salt;
                const hash = saltHash.hash;
                
                // Save Updates
                User.findOneAndUpdate({username: req.user.username}, {hash: hash, salt: salt}, (error, response)=>{
                    if(error) res.status(400).json({ success: false, msg: "could not find user" });
                    res.send(response);
                    res.status(200);
                });
    
            } else {
                res.status(400);
            }
        });
    }
    catch(error){
        console.log(erorr);
    }

});

/**
 * POST: /users/remove
 * This route is used to remove users from the database.
 * @name users/remove
 * @memberof routes/users
 * @param path Express Route Path
 * @param req Request will contain user request issued by Passport Authentication.
 * @returns Status 200 OK on success. return Status 400 otherwise.
 */
router.post('/remove', passport.authenticate('jwt', {session: false}), (req, res) => {

    try{
        User.findOneAndRemove({username: req.user.username});
        res.status(200);
    }
    catch(error){
        console.log(erorr);
        res.status(400);
    }
    

});


// Export Express Router
module.exports = router;