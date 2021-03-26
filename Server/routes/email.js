let nodemailer = require('nodemailer');
const router = require('express').Router();
const dotenv = require('dotenv');
const pdf = require('pdfjs');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const passport = require('passport');

dotenv.config();

/**
 * Configure NodeMailer Transporter Object Settings
 * This is configured with GMAIL Account
 * @param user email account adress
 * @param pass email account password
 * @param service Mail Sending Service
 */
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD
    }
});

/**
 * Verify The Transporter Connection:
 */
transporter.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
});

/**
 * Configure Storage Options for Multer FIle Storage
 * @param destination File storage directory
 * @param filename File naming system
 */
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + Date.now() + '.pdf');
    }
});

/**
 * Set Multer Upload with configured storage settings
 */
var upload = multer({ storage: storage });

/**
 * POST: /email/send
 * This route will send email via NodeMailer Service
 * @name email/send
 * @memberof routes/email
 * @param path Express Route Path
 */
router.post('/send', passport.authenticate('jwt', { session: false }), upload.single('pdf'), (req,res)=>{

    // Set Usename and File from Req Body
    const username = req.user.username;
    const file = req.file;

    try {
        // Mail Options to Send with Email Service
        let mailoptions = {
            from:'easybankmailer@gmail.com',
            to: 'easybankmailer@gmail.com',
            subject: 'EasyBank Transfer Statement',
            text: `Hello ${username}. Find your EasyBank Transfer statement in the attached document.`,
            attachments: file
        }
        // Send mail with transporter settings
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

// Export Express Router
module.exports = router;
