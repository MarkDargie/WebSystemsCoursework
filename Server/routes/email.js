let nodemailer = require('nodemailer');
const router = require('express').Router();
const dotenv = require('dotenv');
const pdf = require('pdfjs');

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

    try {

        let mailoptions = {
            from:'easybankmailer@gmail.com',
            to: 'easybankmailer@gmail.com',
            subject: 'EasyBank Transfer Statement',
            text: `Hello ${username},Find your EasyBank Transfer statement in the attached document.`
        }

        transporter.sendMail(mailoptions, function (error) {
            if(error){
                res.status(500);
            } else {
                res.status(200);
                res.send("Email Sent", mailoptions);
            }
        })

    } catch (error) {
        res.send(error);
    }

});

module.exports = router;
