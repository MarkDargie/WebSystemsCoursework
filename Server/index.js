import {express} from 'express';
import {cors} from 'cors';
import {passport} from 'passport';

/**
 * Create Const Variables
 * @param app setting express app for routes
 * @param port setting port number for app.listen method
 * @param path setting variable for file path
*/ 
const app = express();
const port = 3000;
const path = require('path');

/**
 * Load in Required App Middleware  
*/ 
app.use(passport.initialize());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));

/**
 * Load in App Routes from ./routes Directory
 * @route /users
 * @route /transactions
 * @route /testinglogs
*/ 
app.use(require('./routes'));

/**
 * Load in global passport object into the configuration method
*/ 
require('./config/passport')(passport);

// app listen on set port
app.listen(port, () => {
    console.log(`Server Listening at http://localhost:${port}`)
});