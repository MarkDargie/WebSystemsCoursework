const {mongoose} = require('../db/mongoose');
const router = require('express').Router(); 
const passport = require('passport');

const {User, Transaction} = require('../db/models');
const { response } = require('express');

router.post('/secure', (req, res)=>{

    const transaction = new Transaction({
        to: req.body.sendto,
        from: req.body.username,
        tocode: req.body.tocode,
        fromcode: req.body.fromcode,
        amount: req.body.payment,
        method: req.body.method,
        status: "pending"
    });

    try {

        User.findOne({username: req.body.username, securecode: req.body.fromcode}, function(err, user){
            if(!user){
                return res.status(422);
            }
            User.findOne({username: req.body.sendto, securecode: req.body.tocode}, (error, response)=>{
                if(error) res.sendStatus(404);
            });

            transaction.save();
            res.send(transaction);

        });

    }
    catch(error){
        console.log(erorr);
    }


})

// post transaction
router.post('/express', (req, res, next)=>{

    // maybe create payment service
    const transaction = new Transaction({
        to: req.body.sendto,
        from: req.body.username,
        amount: req.body.payment,
        method: req.body.method,
        status: "confirmed"
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

// POST: Confirm Specified pending secure payments
router.post('/confirm', (req,res,next)=>{

    try{
        Transaction.findOne({_id: req.body.id, from: req.body.username}).then((transaction)=>{
            
            if(!transaction){
                res.sendStatus(422);
            }
            User.findOne({username: req.body.username}, (error, user)=>{
                if(!user) res.sendStatus(400);
                const balanceUpdate = user.balance + transaction.amount;
                user.balance = balanceUpdate;
                user.save();
            }).then(
                User.findOne({username: transaction.from}, (error, fromUser) =>{
                    if(!fromUser) res.sendStatus(400);
                    const fromBalanceUpdate = fromUser.balance - transaction.amount;
                    fromUser.balance = fromBalanceUpdate;
                    fromUser.save();
                })
            );
            transaction.status = "Confirmed";
            transaction.save();
        });
    }
    catch(error){
        console.log(erorr);
    }
});

// GET: all transactions for authenticated user
router.get('/history', passport.authenticate('jwt', { session: false }), (req, res, next)=>{

    Transaction.find({$or: [{to: req.user.username}, {from: req.user.username}]}).then((transactions)=>{
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

// Export Express Router
module.exports = router;
