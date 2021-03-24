const {mongoose} = require('../db/mongoose');
const router = require('express').Router(); 

const {Test} = require('../db/models');
const { text } = require('express');


// Post Methods
// router.post('/create', (req, res)=>{


//     const test = new Test ({

//         securepayments: 0,
//         expresspayments: 0,
//         appstatements: 0,
//         externalstatements: 0,
//         lighttheme: 0,
//         darktheme:0

//     });

//     test.save();
//     res.status(200);


// });

// Get All Results
router.get('/results', (req, res, next) =>{

    Test.findOne({}).then((results)=>{
        res.send(results);
    });

})

router.post('/reset', (req, res, next)=>{
    Test.findOneAndRemove({}).then((response)=>{
        res.status(200);
        res.send(response);
    })
});


router.post('/secure', (req, res)=>{

    Test.findOneAndUpdate({}, {$inc: {'securepayments': 1}}, {new: true}, function(err, response){
        if(err){
            res.status(500);
        } else{
            res.send(response);
        }
    });

});

router.post('/express', (req, res)=>{

    Test.findOneAndUpdate({}, {$inc: {'expresspayments': 1}}, {new: true}, function(err, response){
        if(err){
            res.status(500);
        } else{
            res.send(response);
        }
    });

});

router.post('/appstatement', (req, res)=>{

    Test.findOneAndUpdate({}, {$inc: {'appstatements': 1}}, {new: true}, function(err, response){
        if(err){
            res.status(500);
        } else{
            res.send(response);
        }
    });

});

router.post('/externalstatement', (req, res)=>{

    Test.findOneAndUpdate({}, {$inc: {'externalstatements': 1}}, {new: true}, function(err, response){
        if(err){
            res.status(500);
        } else{
            res.send(response);
        }
    });

});


// MAKE THESE MINUS THE OTHER VALUE WHEN CHANGED

router.post('/lighttheme', (req, res)=>{

    Test.findOneAndUpdate({}, {$inc: {'lighttheme': 1, 'darktheme': -1}}, {new: true}, function(err, response){
        if(err){
            res.status(500);
        } else{
            res.send(response);
        }
    });

});

router.post('/darktheme', (req, res)=>{

    Test.findOneAndUpdate({}, {$inc: {'darktheme': 1, 'lighttheme': -1}}, {new: true}, function(err, response){
        if(err){
            res.status(500);
        } else{
            res.send(response);
        }
    });

});


module.exports = router;