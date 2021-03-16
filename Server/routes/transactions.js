const {mongoose} = require('../db/mongoose');
const router = require('express').Router(); 
const passport = require('passport');

const {User, Transaction} = require('../db/models');

// post transaction
router.post('/transaction', (req, res, next)=>{

    try{

        User.findOne({username: req.body.username}, function(err, user){
            if(!user){
                return res.status(422);
            }

            const payment =  user.balance - req.body.payment;

            if(payment){
                // do this for both to and from users
                User.findOneAndUpdate({username: req.body.username}, {balance: payment}, (error, response)=>{
                    if(error) res.sendStatus(404);
                    console.log(response);
                    res.send(response);
                });

                // maybe create payment service
                const transaction = new Transaction({
                    to: req.body.sendto,
                    from: req.body.username,
                    amount: req.body.payment,
                    method: req.body.method
                });

                transaction.save();

            } else {
                res.sendStatus(422);
            }

        });

    }
    catch(error){
        console.log(erorr);
    }

});

// post user balance changes

// Export Express Router
module.exports = router;
