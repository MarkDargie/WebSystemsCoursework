let nodemailer = require('nodemailer');
const router = require('express').Router();
const dotenv = require('dotenv');
const pdf = require('pdfjs');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const passport = require('passport');

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

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + Date.now() + '.pdf');
    }
});
   
var upload = multer({ storage: storage });

router.post('/send', passport.authenticate('jwt', { session: false }), upload.single('pdf'), (req,res)=>{

    const username = req.user.username;

    const file = req.file;
    console.log(file);
    console.log("USERID", username);

    try {

        let mailoptions = {
            from:'easybankmailer@gmail.com',
            to: 'easybankmailer@gmail.com',
            subject: 'EasyBank Transfer Statement',
            text: `Hello ${username}. Find your EasyBank Transfer statement in the attached document.`,
            attachments: file
        }

        transporter.sendMail(mailoptions, function (error) {
            if(error){
                res.status(500);
            } else {
                res.status(200).send(mailoptions);
            }
        });

    } catch (error) {
        res.send(error);
    }

});

module.exports = router;
