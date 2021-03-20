const {mongoose} = require('../db/mongoose');
const router = require('express').Router(); 
const passport = require('passport');

const {User, Transaction} = require('../db/models');
const { response } = require('express');

// post transaction
router.post('/transaction', (req, res, next)=>{

    // maybe create payment service
    const transaction = new Transaction({
        to: req.body.sendto,
        from: req.body.username,
        amount: req.body.payment,
        method: req.body.method
    });

    try{

        User.findOne({username: req.body.username}, function(err, user){
            if(!user){
                return res.status(422);
            }

            const sentpayment =  user.balance - req.body.payment;

            if(sentpayment){
                // do this for both to and from users
                User.findOneAndUpdate({username: req.body.username}, {balance: sentpayment}, (error, response)=>{
                    if(error) res.sendStatus(404);
                    console.log("sender response", response);
                    // res.send(response);
                });
                
            } else {
                res.sendStatus(422);
            }

        }).then(
            User.findOne({username: req.body.sendto}, function (err, user){
                if(!user){
                    return res.status(422);
                }

                const receivedpayment = user.balance + req.body.payment;

                if(receivedpayment){
                    User.findOneAndUpdate({username: req.body.sendto}, {balance: receivedpayment}, (error, response)=>{
                        if(error) res.sendStatus(404);
                        console.log("sent to response", response);
                        // res.send(response);
                    });
                    transaction.save();
                } else {
                    res.sendStatus(422);
                }

            })
        );

        res.sendStatus(200);

    }
    catch(error){
        console.log(erorr);
    }

});

// post user balance changes

// Export Express Router
module.exports = router;
