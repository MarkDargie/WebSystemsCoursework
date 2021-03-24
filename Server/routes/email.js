let nodemailer = require('nodemailer');
const router = require('express').Router();
const dotenv = require('dotenv');

dotenv.config();

// Create NodeMailer Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'easybankmailer@gmail.com',
        pass: 'Emmalexi1997'
    }
});

// verify connection configuration
transporter.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
});

router.post('/send', (req,res)=>{

    

})

module.exports = router;
