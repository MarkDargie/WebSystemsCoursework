const mongoose = require('mongoose');

/**
 * Create User Schema for MongoDB Database
 * @param id unique transaction ID
 * @param to recipient user ID
 * @param from sender user ID
 * @param amount transaction value
 * @param method payment transaction method
 * @param status transaction status
 * @param date date of transaction
*/ 
const TransactionSchema = new mongoose.Schema({

    id:{type: mongoose.Schema.Types.ObjectId},
    to: {type: String , required: true, trim: true},
    from: {type: String, required: true, trim: true},
    amount: {type: Number, required: true},
    method: {type: String, required: true, trim: true},
    status: {type: String, required: true, trim: true},
    date: { type: String, required: true, trim: true },
    timestamp: { type: Date, default: Date.now}

});

// Create const mongoose model from Transaction Model
const Transaction = mongoose.model('Transaction', TransactionSchema);

// Export Transaction model
module.exports = {
    Transaction
}