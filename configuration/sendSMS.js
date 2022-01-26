
const fast2sms = require('fast-two-sms');
const createHttpError = require('http-errors');

const { Otp } = require('../models');
// this API is valid upto 28 JAN 2022
const sendOptions = {
    authorization: process.env.SMS_API_KEY,
    message: 'YOUR_MESSAGE_HERE',
    numbers: []
};

const sendOTP = async (number, name) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    sendOptions.numbers = [number];
    sendOptions.message = `${name},\nTo validate signup here is otp : ${otp} plese do not share this otp.\n Note: OTP valid upto 20 min`;
    const res = await fast2sms.sendMessage(sendOptions);
    //res.OTP = otp;
    if (res.return) {
        await Otp.save(otp, res).then(resolve =>{
            res.otpId = resolve.insertedId;
        }).catch(err => { res.error = err});

    }
    return res;

    // console.log(res);
    
};

const resetOTP= async (number, name) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    sendOptions.numbers = [number];
    sendOptions.message = `${name},\nReset Password here is otp : ${otp} plese do not share this otp.\n Note: OTP valid upto 20 min`;
    const res = await fast2sms.sendMessage(sendOptions);
    //res.OTP = otp;
    if (res.return) {
        await Otp.save(otp, res).then(resolve =>{
            console.log(resolve.insertedId);
            res.otpId = resolve.insertedId;
        }).catch(err => { res.error = err});
        // console.log(res);
    }
    return res;
};

module.exports = { sendOTP, resetOTP};
