const mongoose = require('mongoose');

/**
 * Create User Schema for MongoDB Database
 * @param id unique DB ID
 * @param email user email string
 * @param username user username string
 * @param hash password generated hash
 * @param salt password generated salt
 * @param securecode user 4digit secure code
 * @param balance user account balance values 
 * @param access user acess level
 * @param paymentmethods array of method schema objects
*/ 
const UserSchema = new mongoose.Schema({

    id: {type: mongoose.Schema.Types.ObjectId},
    email: {type:String, required: true, trim: true},
    username:{type: String, required: true, trim: true},
    hash: {type: String},
    salt: {type: String},
    securecode: {type: String, required: true, trim: true},
    balance: {type: Number, required: true},
    access: {type: String, required: true, trim: true},
    paymentmethods: [{type: mongoose.Schema.Types.Mixed, ref: 'Method'}]

});

// Create const mongoose model from user schema
const User = mongoose.model('User', UserSchema);

// export User schema
module.exports = {
    User
}

