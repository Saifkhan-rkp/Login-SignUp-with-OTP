const nodemailer = require('nodemailer');
const { OTP } = require('../models');

const sendOTPEmail = (email, name) =>{

    const otp = Math.floor(100000 + Math.random() * 900000);
    //let testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        service: 'gamil',
        host: 'smtp.google.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PSWD
        },
        tls:{
            rejectUnauthorized:false
        }
    });
    let mailOptions = {
        from: 'Assignment..!',
        to: email,
        subject: 'Email SignUp Verification',
        // text: 'This email is sent using Node js with nodemailer'
        html: `<h1>Welcome ${name}</h1>
        <p>Here is a OTP : <h3>${otp}</h3> to complete the Signup Process.</p><br>`
    };
    let res;
    console.log('EMAIL OTP : ',otp);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            res = info.response;
            console.log('Email sent: ' + info.response);
            OTP.save(otp,res).then(result =>{
                res.otpId = result.insertedId;
                res.message = "OTP has been sent Sucessfully to your emai.";
            }).catch(err => {res.error = err});
            return res;
        }
    });
    
};
// const 

module.exports = sendOTPEmail;
