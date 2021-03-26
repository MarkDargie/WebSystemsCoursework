const {mongoose} = require('../db/mongoose');
const router = require('express').Router(); 
const passport = require('passport');
const moment = require('moment');

const {User, Transaction} = require('../db/models');
const { response } = require('express');

router.post('/secure', passport.authenticate('jwt', {session: false }), (req, res)=>{

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);

    const transaction = new Transaction({
        to: req.body.sendto,
        from: req.user.username,
        tocode: req.body.tocode,
        fromcode: req.body.fromcode,
        amount: req.body.payment,
        method: "secure",
        status: "pending",
        date: today.toLocaleDateString()
    });

    console.log(transaction);

    try {

        User.findOne({username: req.user.username, securecode: req.body.fromcode}, function(err, user){
            if(!user){
               return res.status(422).json({ success: false, msg: "could not find user" });
            }
            User.findOne({username: req.body.sendto, securecode: req.body.tocode}, (error, user)=>{
                // if(!user) return res.sendStatus(404).json({ success: false, msg: "could not find user" });
                res.status(200).json({ success: true, msg: "Payment Sent" });
            });

            transaction.save();
            // res.sendStatus(200).json({ success: true, msg: "Payment Sent" });

        });

    }
    catch(error){
        console.log(erorr);
    }


})

// post transaction
router.post('/express', passport.authenticate('jwt', {session: false }), (req, res, next)=>{


    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);


    // maybe create payment service
    const transaction = new Transaction({
        to: req.body.sendto,
        from: req.user.username,
        amount: req.body.payment,
        method: "express",
        status: "confirmed",
        date: today.toLocaleDateString()
    });

    console.log(transaction);

    try{

        User.findOne({username: req.user.username}, function(err, user){
            if(!user){
                res.status(422).json({ success: false, msg: "Errro" });
            }

            const sentpayment =  user.balance - req.body.payment;

            if(sentpayment){
                // do this for both to and from users
                User.findOneAndUpdate({username: req.user.username}, {balance: sentpayment}, (error, response)=>{
                    if(error) res.status(404);
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
                        if(error) res.status(404).json({ success: false, msg: "Error" });
                        console.log("sent to response", response);
                    });
                    transaction.save();
                    res.status(200).json({ success: true, msg: "Payment Sent" });
                } else {
                    res.status(422).json({ success: false, msg: "Error" });
                }

            })
        );

        // res.sendStatus(200);

    }
    catch(error){
        console.log(erorr);
    }

});

// POST: Confirm Specified pending secure payments
router.post('/confirm', passport.authenticate('jwt', {session: false }),(req,res,next)=>{

    console.log("confirm route hit: ", req.body.id, req.body.from);


    try{
        Transaction.findOne({_id: req.body.id, from: req.body.from}).then((transaction)=>{
            
            if(!transaction){
                res.status(422);
            }
            User.findOne({username: req.user.username}, (error, user)=>{
                if(!user) res.status(400).json({ success: false, msg: "Error: Payment Not Confirmed" });
                const balanceUpdate = user.balance + transaction.amount;
                user.balance = balanceUpdate;
                user.save();
            }).then(
                User.findOne({username: transaction.from}, (error, fromUser) =>{
                    if(!fromUser) res.status(400).json({ success: false, msg: "Error: Payment Not Confirmed" });
                    const fromBalanceUpdate = fromUser.balance - transaction.amount;
                    fromUser.balance = fromBalanceUpdate;
                    fromUser.save();
                })
            );
            transaction.status = "confirmed";
            transaction.save();
            res.status(200).json({ success: true, msg: "Payment Confirmed" });
        });
    }
    catch(error){
        console.log(erorr);
    }
});

router.post('/reject', passport.authenticate('jwt', {session: false }), (req,res, next)=>{

    console.log('reject route hit');

    try{
        Transaction.findOneAndRemove({_id: req.body.id}, (error, response)=>{
            if(error) res.status(500).json({ success: false, msg: "Server Error: Reject Payment" });
        });

        res.status(200).json({ success: true, msg: "Payment Rejected" });
    }
    catch(error){
        console.log(erorr);
    }

})

// GET: all transactions for authenticated user
router.get('/history', passport.authenticate('jwt', { session: false }), (req, res, next)=>{

    Transaction.find({$or: [{to: req.user.username}, {from: req.user.username}]}).sort('date').then((transactions)=>{
        res.send(transactions);
    }).catch((err) => {
        next(err);
    });

});

// GET: all received payment for authenticated user
router.get('/received', passport.authenticate('jwt', { session: false }), (req, res, next) =>{
    Transaction.find({to: req.user.username}).then((transactions)=>{
        res.send(transactions);
    }).catch((err) => {
        next(err);
    });
});

// GET: all sent payment for authenticated user
router.get('/sent', passport.authenticate('jwt', { session: false }), (req, res, next) =>{
    Transaction.find({from: req.user.username}).then((transactions)=>{
        res.send(transactions);
    }).catch((err) => {
        next(err);
    });
});

// GET: all pending payments for authenticatd user
router.get('/pending', passport.authenticate('jwt', {session: false }), (req, res, next)=>{
    Transaction.find({to: req.user.username, status: "pending"}).then((transactions)=>{
        res.send(transactions);
    }).catch((err)=>{
        next(err);
    });
});

// Export Express Router
module.exports = router;
