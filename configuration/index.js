const { sendOTP, resetOTP } = require('./sendSMS');


module.exports = {
    logger : require('./logger'),
    dbCon : require('./db'),
    sendEmail: require('./sendEmail'),
    sendOTP,
    resetOTP
}