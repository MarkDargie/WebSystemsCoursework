const {mongoose} = require('../db/mongoose');
const router = require('express').Router(); 
const {Test} = require('../db/models');

/**
 * GET: /logs/results
 * This route will return all A/B testing results
 * @name logs/results
 * @memberof routes/logs
 * @param path Express Route Path
 * @returns All Test results from MongoDB Database
 */
router.get('/results', (req, res, next) =>{

    Test.findOne({}).then((results)=>{
        res.send(results);
    });

});

/**
 * POST: /logs/reset
 * This route will Remove all test logs
 * @name logs/reset
 * @memberof routes/logs
 * @param path Express Route Path
 * @returns Status 200 OK and removes all recorded test results
 */
router.post('/reset', (req, res, next)=>{
    Test.findOneAndRemove({}).then((response)=>{
        res.status(200);
        res.send(response);
    })
});

/**
 * POST: /logs/secure
 * This route will Increment number of secure tranfers value
 * @name logs/secure
 * @memberof routes/logs
 * @param path Express Route Path
 * @returns Return Response and increments value change
 */
router.post('/secure', (req, res)=>{
    Test.findOneAndUpdate({}, {$inc: {'securepayments': 1}}, {new: true}, function(err, response){
        if(err){
            res.status(400);
        } else{
            res.send(response);
        }
    });
});

/**
 * POST: /logs/express
 * This route will Increment number of express tranfers value
 * @name logs/express
 * @memberof routes/logs
 * @param path Express Route Path
 * @returns Return Response and increments value change
 */
router.post('/express', (req, res)=>{
    Test.findOneAndUpdate({}, {$inc: {'expresspayments': 1}}, {new: true}, function(err, response){
        if(err){
            res.status(400);
        } else{
            res.send(response);
        }
    });
});

/**
 * POST: /logs/appstatement
 * This route will Increment number of direct statement requests
 * @name logs/appstatement
 * @memberof routes/logs
 * @param path Express Route Path
 * @returns Return Response and increments value change
 */
router.post('/appstatement', (req, res)=>{
    Test.findOneAndUpdate({}, {$inc: {'appstatements': 1}}, {new: true}, function(err, response){
        if(err){
            res.status(400);
        } else{
            res.send(response);
        }
    });
});

/**
 * POST: /logs/externalstatement
 * This route will Increment number of external email statement requests
 * @name logs/externalstatement
 * @memberof routes/logs
 * @param path Express Route Path
 * @returns Return Response and increments value change
 */
router.post('/externalstatement', (req, res)=>{
    Test.findOneAndUpdate({}, {$inc: {'externalstatements': 1}}, {new: true}, function(err, response){
        if(err){
            res.status(400);
        } else{
            res.send(response);
        }
    });
});

/**
 * POST: /logs/lighttheme
 * This route will Increment number of users using light theme setting
 * @name logs/lighttheme
 * @memberof routes/logs
 * @param path Express Route Path
 * @returns Return Response and increments value change
 */
router.post('/lighttheme', (req, res)=>{
    Test.findOneAndUpdate({}, {$inc: {'lighttheme': 1, 'darktheme': -1}}, {new: true}, function(err, response){
        if(err){
            res.status(400);
        } else{
            res.send(response);
        }
    });
});

/**
 * POST: /logs/darktheme
 * This route will Increment number of users using darktheme theme setting
 * @name logs/darktheme
 * @memberof routes/logs
 * @param path Express Route Path
 * @returns Return Response and increments value change
 */
router.post('/darktheme', (req, res)=>{

    Test.findOneAndUpdate({}, {$inc: {'darktheme': 1, 'lighttheme': -1}}, {new: true}, function(err, response){
        if(err){
            res.status(400);
        } else{
            res.send(response);
        }
    });

});

// Export Express Router
module.exports = router;