'use strict';
const nodemailer = require('nodemailer');


let result = false;
// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
let sendMail =  (mailDetails) =>{
    
nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service:"Gmail",
        auth: {
            user: 'projectankit33@gmail.com', // generated ethereal user
            pass: 'Welcome@2016' // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"My-List 👻" <projectankit33@gmail.com>', // sender address
        to: mailDetails.receiver, // list of receivers
        subject: mailDetails.subject, // Subject line
        // text: mailDetails.text, // plain text body
        html: mailDetails.html // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {

        if(error){
            result = false;
        }else{
            result =  true;;
        }

        // Preview only available when sending through an Ethereal account
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    });

    

});

return result;

}


module.exports = {
    sendMail:sendMail
}