import {mongoose} from 'mongoose';

// Set and Configure dotenv
const dotenv = require('dotenv');
dotenv.config();

// Set Global Promise for Mongoose
mongoose.Promise = global.Promise;

/**
 * Connecting to MongoDB Database
 * @param DB_CONNECT connection string for database connection
 */
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true}).then(() => {
        console.group("Connected to MongoDB Database: ");
    }).catch((e) => {
        console.log("Error connecting to database: ");
        console.log(e);
});

// handle deprecation warnings
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

// Export Mongoose
module.exports = {
    mongoose
}