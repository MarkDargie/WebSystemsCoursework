const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/payments', require('./payments'));
router.use('/logs', require('./testinglogs'));

module.exports = router;