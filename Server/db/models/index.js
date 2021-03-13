const {User} = require('./user');
const {Transaction} = require('./transaction');

/**
 * This Model index imports and exports all mongoose models from this directory
 * NOTE: Import required models from this index file
 */

// Export Mongoose Models
module.exports = {
    User,
    Transaction
}