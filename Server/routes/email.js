let nodemailer = require('nodemailer');
const router = require('express').Router();
const dotenv = require('dotenv');
const pdf = require('pdfjs');
const fs = require('fs');

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

    const username = req.body.username;
    // get transactions
    
    const doc = new pdf.Document({
        font: require('pdfjs/font/Helvetica'),
        padding:10,
        title: "Your EasyBank Statement"
    });

    doc.pipe(fs.createWriteStream('test.pdf'));

    const header = doc.header();
    header.text('EasyBank Statement');

    doc.text("testin 123");
    const text = doc.text({ fontSize: 12});
    text.add("testing 123");

    doc.end();

    try {

        let mailoptions = {
            from:'easybankmailer@gmail.com',
            to: 'easybankmailer@gmail.com',
            subject: 'EasyBank Transfer Statement',
            text: `Hello ${username}. Find your EasyBank Transfer statement in the attached document.`
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
