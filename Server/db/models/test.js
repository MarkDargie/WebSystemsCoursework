const mongoose = require('mongoose');


const TestSchema = new mongoose.Schema({

    securepayments: {type: Number},
    expresspayments:{type: Number},
    appstatements:{type: Number},
    externalstatements: {type: Number},
    lighttheme: {type: Number},
    darktheme:{type: Number}


});

const Test = mongoose.model('Test', TestSchema);

module.exports = {
    Test
}