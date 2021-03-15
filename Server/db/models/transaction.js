const mongoose = require('mongoose');

/**
 * Create User Schema for MongoDB Database
 * @param id unique transaction ID
 * @param to recipient user ID
 * @param from sender user ID
 * @param amount transaction value
 * @param date date of transaction
*/ 
const TransactionSchema = new mongoose.Schema({

    id:{type: mongoose.Schema.Types.ObjectId},
    to: {type: String},
    from: {type: String},
    amount: {type: Number},
    method: {type: String},
    date: {Type: Date}

});

// Create const mongoose model from Transaction Model
const Transaction = mongoose.model('Transaction', TransactionSchema);

// Export Transaction model
module.exports = {
    Transaction
}