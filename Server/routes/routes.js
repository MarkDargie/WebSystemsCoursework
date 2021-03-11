const router = require('express').Router();

/**
 * API Routes
 * This is the index for all routes required for the server
 * NOTE: Import all required routes from this index
 */
router.use('/users', require('./users'));
router.use('/transactions', require('./transactions'));
router.use('/logs', require('./testinglogs'));

// Export Express Router
module.exports = router;