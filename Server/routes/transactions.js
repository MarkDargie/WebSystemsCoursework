const {mongoose} = require('../db/mongoose');
const router = require('express').Router(); 
const passport = require('passport');
const moment = require('moment');
const {User, Transaction} = require('../db/models');
const { response } = require('express');

/**
 * POST: /transactions/secure
 * @name transactions/secure
 * @memberof routes/transactions
 * @param path Express Route Path
 * @param passport Utilises passport authenticate method to protect route
 * @returns Saves Secure Transaction to Database. Returns Status 201 on success, 400 Otherwise.
 */
router.post('/secure', passport.authenticate('jwt', {session: false }), (req, res)=>{

    // Date formatting
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);

    // Create Secure Transaction Object
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
    try {
        User.findOne({username: req.user.username, securecode: req.body.fromcode}, function(err, user){
            if(!user){
               return res.status(400).json({ success: false, msg: "could not find user" });
            }
            User.findOne({username: req.body.sendto, securecode: req.body.tocode}, (error, user)=>{
                // if(!user) return res.sendStatus(404).json({ success: false, msg: "could not find user" });
                res.status(200).json({ success: true, msg: "Payment Sent" });
            });
            transaction.save();
        });
    }
    catch(error){
        console.log(erorr);
    }
});

/**
 * POST: /transactions/express
 * @name transactions/express
 * @memberof routes/transactions
 * @param path Express Route Path
 * @param passport Utilises passport authenticate method to protect route
 * @returns Saves Express Transaction to Database. Returns Status 200 on success, 400 Otherwise.
 */
router.post('/express', passport.authenticate('jwt', {session: false }), (req, res, next)=>{

    // Date formatting options
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

    try{
        User.findOne({username: req.user.username}, function(err, user){
            if(!user){
                res.status(400).json({ success: false, msg: "Errro" });
            }

            // Set Payment Change variable
            const sentpayment =  user.balance - req.body.payment;
            // If payment, find and update user balance change
            if(sentpayment){
                User.findOneAndUpdate({username: req.user.username}, {balance: sentpayment}, (error, response)=>{
                    if(error) res.status(404);
                });
                
            } else {
                res.status(400);
            }

        }).then(
            // Repeat the above step for the recipient user
            User.findOne({username: req.body.sendto}, function (err, user){
                if(!user){
                    return res.status(400);
                }

                // Set Payment Change variable
                const receivedpayment = user.balance + req.body.payment;

                if(receivedpayment){
                    User.findOneAndUpdate({username: req.body.sendto}, {balance: receivedpayment}, (error, response)=>{
                        if(error) res.status(404).json({ success: false, msg: "Error" });
                        console.log("sent to response", response);
                    });
                    transaction.save();
                    res.status(200).json({ success: true, msg: "Payment Sent" });
                } else {
                    res.status(400).json({ success: false, msg: "Error" });
                }

            })
        );
    }
    catch(error){
        console.log(erorr);
    }
});

/**
 * POST: /transactions/confirm
 * @name transactions/confirm
 * @memberof routes/transactions
 * @param path Express Route Path
 * @param passport Utilises passport authenticate method to protect route
 * @returns Confirms Pending Transaction from authenticated user and updates changes. Returns Status 200 on success, 400 Otherwise.
 */
router.post('/confirm', passport.authenticate('jwt', {session: false }),(req,res,next)=>{
    try{
        Transaction.findOne({_id: req.body.id, from: req.body.from}).then((transaction)=>{
            
            if(!transaction){
                res.status(400);
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

/**
 * POST: /transactions/reject
 * @name transactions/reject
 * @memberof routes/transactions
 * @param path Express Route Path
 * @param passport Utilises passport authenticate method to protect route
 * @returns Rejects Pending Transaction from authenticated user. Returns Status 200 on success, 400 Otherwise.
 */
router.post('/reject', passport.authenticate('jwt', {session: false }), (req,res, next)=>{

    try{
        Transaction.findOneAndRemove({_id: req.body.id}, (error, response)=>{
            if(error) res.status(500).json({ success: false, msg: "Server Error: Reject Payment" });
        });
        res.status(200).json({ success: true, msg: "Payment Rejected" });
    }
    catch(error){
        console.log(erorr);
    }

});

/**
 * GET: /transactions/history
 * @name transactions/history
 * @memberof routes/transactions
 * @param path Express Route Path
 * @param passport Utilises passport authenticate method to protect route
 * @returns Return all transactions for authenticated user.
 */
router.get('/history', passport.authenticate('jwt', { session: false }), (req, res, next)=>{
    Transaction.find({$or: [{to: req.user.username}, {from: req.user.username}]}).sort('date').then((transactions)=>{
        res.send(transactions);
    }).catch((err) => {
        next(err);
    });
});

/**
 * GET: /transactions/received
 * @name transactions/received
 * @memberof routes/transactions
 * @param path Express Route Path
 * @param passport Utilises passport authenticate method to protect route
 * @returns Return all received transactions for authenticated user.
 */
router.get('/received', passport.authenticate('jwt', { session: false }), (req, res, next) =>{
    Transaction.find({to: req.user.username}).then((transactions)=>{
        res.send(transactions);
    }).catch((err) => {
        next(err);
    });
});

/**
 * GET: /transactions/sent
 * @name transactions/sent
 * @memberof routes/transactions
 * @param path Express Route Path
 * @param passport Utilises passport authenticate method to protect route
 * @returns Return all sent transactions for authenticated user.
 */
router.get('/sent', passport.authenticate('jwt', { session: false }), (req, res, next) =>{
    Transaction.find({from: req.user.username}).then((transactions)=>{
        res.send(transactions);
    }).catch((err) => {
        next(err);
    });
});

/**
 * GET: /transactions/pending
 * @name transactions/pending
 * @memberof routes/transactions
 * @param path Express Route Path
 * @param passport Utilises passport authenticate method to protect route
 * @returns Return all pending transactions for authenticated user.
 */
router.get('/pending', passport.authenticate('jwt', {session: false }), (req, res, next)=>{
    Transaction.find({to: req.user.username, status: "pending"}).then((transactions)=>{
        res.send(transactions);
    }).catch((err)=>{
        next(err);
    });
});

// Export Express Router
module.exports = router;
