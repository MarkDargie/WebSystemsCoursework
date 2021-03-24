const {User} = require('./user');
const {Transaction} = require('./transaction');
const {Method} = require('./method');
const {Test} = require('./test');

/**
 * This Model index imports and exports all mongoose models from this directory
 * NOTE: Import required models from this index file
 */

// Export Mongoose Models
module.exports = {
    User,
    Transaction,
    Method,
    Test
}