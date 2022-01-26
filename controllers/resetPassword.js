const jwt = require('jsonwebtoken');
const { readFileSync } = require('fs');
const secretK = readFileSync('./private.key')
const { dbCon, sendEmail, resetOTP } = require("../configuration");
const Joi = require('@hapi/joi');
const createHttpError = require("http-errors");
const { OTP, User } = require('../models');
const { ObjectId } = require('bson');
const { hashSync } = require('bcryptjs');



const resetPassword = (req, res, next) => {
    let token = req.query.token;
    const decoded = jwt.verify(token, secretK);
    const otp = req.query.value;
    const otpId = new ObjectId(req.params.id);
    
    //*****++++++++ there is no validation for password ++++++++++++++
    const password = hashSync(req.body['password'],12);
    if (!ObjectId.isValid(req.params.id)) {
        return next(createHttpError(400));
    }
    dbCon('OTP', async (db) => {
        try {
            let tempres = {check: false};
            const res2 = await db.findOne({ _id: otpId }, { projection:{otp:1, expiration_time : 1}});
            console.log(res2);
            if (!res2) {
                tempres.message = 'Invalid url';
            }else if(new Date() >= res2.expiration_time){
                tempres.check = false ;
                tempres.message = 'OTP Expired';
            }else if (res2.otp == otp) {
                tempres = await db.updateOne({_id:otpId},{'$set':{verified: true}, '$currentDate': {updated_At: true}});
                if(tempres.modifiedCount)
                    tempres.check = true;
            }else{
                tempres.check = false;
                tempres.message = 'OTP is not matched, please enter correct otp';
            }
            if (tempres.check) {
                User.update(decoded['username'], password).then(resolve =>{
                    res.status(201).json({message: resolve.message});
                });
            }else{
                res.json({message:tempres.message})
            }
        } catch (err) {
            console.log(err);
            next(createHttpError(500));
        }
    });
};

const postReq = (req, res, next) => {
    const resetEmail = req.body["email"];
    const resetPhone = req.body['phone'];
    if (!Joi.string().email().required().validate(resetEmail) || !Joi.string().regex(/^[0-9]{10}$/).required().validate(resetPhone)) {
        next(createHttpError(409));
    }
    let result;
    // console.log(resetEmail, resetPhone);
    if (!resetEmail) {
        dbCon('users', async (db) => {
            try {
                const user = await db.findOne({ phone: resetPhone });
                if (!user) {

                    res.json({
                        message: ' User Not Found. enter Correct email'
                    });

                } else if (user.phone == resetPhone) {
                    const token = jwt.sign({ username: user.username }, secretK, {
                        expiresIn: '1h'
                    });
                    result = await resetOTP(user.phone, user.first_name);
                    // console.log(result);
                    res.json({
                        url: `/resetPassword/${result.otpId}?token=${token}&value=`,
                        message: result.message
                    });

                }
            } catch (error) {
                console.log(error);
                next(createHttpError(500));
            }
        });
    } else {
        dbCon('users', async (db) => {
            try {
                let user = {};
                user = await db.findOne({ email: resetEmail });
                // console.log('user = ', user);
                if (!user) {

                    res.json({
                        message: ' User Not Found. enter Correct email'
                    });

                } else if (user.email == resetEmail) {
                    const result = sendEmail(user.email, user.first_name);
                    console.log(result);
                    let token = jwt.sign(user.username, secretK);
                    res.json({
                        url: `resetPassword/${result.otpId}?token=${token}&value=`,
                        message: result.message
                    });
                }
            } catch (error) {
                console.log(error);
                next(createHttpError(500));
            }
        });
    }

};



module.exports = {
    resetPassword,
    postReq
};