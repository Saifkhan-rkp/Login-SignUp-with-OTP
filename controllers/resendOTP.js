const jwt = require('jsonwebtoken');
const { readFileSync } = require('fs');
const { dbCon, sendOTP, sendEmail } = require('../configuration');
// const { ObjectId } = require('bson');
const createHttpError = require('http-errors');
const secretK = readFileSync('./private.key');


const resendOTP = (req, res, next) => {
    let token = req.query.token;
    const decoded = jwt.verify(token, secretK);
    let nxtToken = jwt.sign(decoded['username'], secretK);
    dbCon('users', async (db) => {
        try {
            const result = await db.findOne({ username: decoded['username'] }, { projecton: { email: 1, phone: 1, first_name: 1 } });
            if (result.phone == "") {
                const sendData = sendEmail(result.email, result.first_name);
                res.json({
                    url: `/auth/verify/${sendData.otpId}/?token=${nxtToken}&value=`,
                    message: result.message
                });
            } else {
                const sendData =await sendOTP(result.phone, result.first_name);
                res.json({
                    url: `/auth/verify/${sendData.otpId}/?token=${nxtToken}&value=`,
                    message: result.message
                });
            }
        } catch (err) {
            next(createHttpError(500));
        }
    });
};

module.exports = resendOTP;