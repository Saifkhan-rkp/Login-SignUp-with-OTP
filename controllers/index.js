const { postSignup } = require('./auth/signup');
const { postLogin } = require('./auth/login');
const { getVerify } = require('./auth/verification');
const { postReq, resetPassword} = require('./resetPassword');
const resendOTP = require('./resendOTP');


module.exports = {
    postSignup,
    postLogin,
    getVerify,
    //resetPassword
    resetPassword,
    postReq,
    resendOTP
};