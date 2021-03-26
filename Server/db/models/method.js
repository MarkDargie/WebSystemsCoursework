const mongoose = require('mongoose');

const MethodSchema = new mongoose.Schema({

    name: {type: String},
    number: {type: String},
    address: {type: String},
    holder: {type: String},
    cvv: {type: String}

});

const Method = mongoose.model('Method', MethodSchema);

module.exports = {
    Method
}