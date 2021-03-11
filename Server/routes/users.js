import {mongoose} from '../db/mongoose';
import {passport} from 'passport';
import {utils} from '../lib/utils';

const router = require('express').Router();
const {User} = require('../db/models');

/**
 * GET: /users/protected
 * This route is used to verify the authentication of users and restrict access to protected application routes
 * NOTE: This will be used for Angular Profile Guards for client access restrictions
 */
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!"});
});


/**
 * POST: /users/login
 */
router.post('/login', (req, res) => {

    // user.findone

});