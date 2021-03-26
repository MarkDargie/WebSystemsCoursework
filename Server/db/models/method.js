const mongoose = require('mongoose');

/**
 * Create Method Schema for MongoDB Database
 * @param name name of payment method
 * @param number payment method number
 * @param holderayment payment method holder
 * @param cvv card cvv number
*/ 
const MethodSchema = new mongoose.Schema({

    name: {type: String, required: true, trim: true},
    number: {type: String, required: true, trim: true},
    address: {type: String, required: true, trim: true},
    holder: {type: String, required: true, trim: true},
    cvv: {type: String, required: true, trim: true}

});

// Create const mongoose model from Method Model
const Method = mongoose.model('Method', MethodSchema);

// Export Method model
module.exports = {
    Method
}