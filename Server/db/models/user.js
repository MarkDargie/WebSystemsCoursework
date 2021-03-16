const mongoose = require('mongoose');

/**
 * Create User Schema for MongoDB Database
 * @param email user email string
 * @param hash password generated hash
 * @param salt password generated salt
 * @param currency currency type string 
 * @param balance user account balance values 
 * @param preference preference setting for dashboard layout 
*/ 
const UserSchema = new mongoose.Schema({

    id: {type: mongoose.Schema.Types.ObjectId},
    email: {type:String},
    username:{type: String},
    hash: {type: String},
    salt: {type: String},
    securecode: {type: String},
    balance: {type: Number},
    access: {type: String},
    paymentmethods: [{type: mongoose.Schema.Types.Mixed, ref: 'Method'}]

});

// Create const mongoose model from user schema
const User = mongoose.model('User', UserSchema);

// export User schema
module.exports = {
    User
}

