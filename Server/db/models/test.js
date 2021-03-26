const mongoose = require('mongoose');

/**
 * Create A/B Testing Schema for MongoDB Database
 * @param securepayments number of secure payments
 * @param expresspayments number of express payments
 * @param appstatements number of direct statement requests
 * @param externalstatement number of external statement requests
 * @param lighttheme number of users using light theme
 * @param darktheme number of users using dark theme

*/ 
const TestSchema = new mongoose.Schema({

    securepayments: {type: Number, required: true},
    expresspayments:{type: Number, required: true},
    appstatements:{type: Number, required: true},
    externalstatements: {type: Number, required: true},
    lighttheme: {type: Number, required: true},
    darktheme:{type: Number, required: true}


});
// Create const mongoose model from Test Model
const Test = mongoose.model('Test', TestSchema);

// Export Test Model
module.exports = {
    Test
}