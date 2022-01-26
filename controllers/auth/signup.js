const createHttpError = require('http-errors');
const {User} =require('../../models');
const { sendEmail, sendOTP}= require('../../configuration');
const jwt = require('jsonwebtoken');
const {readFileSync} =require('fs');
const secretK = readFileSync('./private.key');

const postSignup = (req, res, next) =>{

    const validation = User.validate(req.body);
    console.log(req.body);
    if (validation.error) {
        const error = new Error(validation.error.message);
        error.statusCode= 400;
        return next(error);
    }
    let userData = new Object(req.body);

    //check Existence
    const user = new User(userData);
    user.checkExistence().then(result =>{
        if (result.check) {
            const err = new Error(result.message);
            err.statusCode = 409;
            return next(err);
        }
        user.save(async (err)=>{
            let result;
            if (err) {
                console.log(err);
                return next(createHttpError(500));
            }
            if (userData['phone']) {
               result = await sendOTP(userData["phone"],userData['first_name']);
            }else{
                result = sendEmail(userData['email'],userData['first_name']);
            }
            const token = jwt.sign({username:user.userData['username']},secretK,{
                expiresIn: '1h'
            });
            res.status(201).json({
                url :`/auth/verify/${result.otpId}?token=${token}&value=`,
                message: "Account Created Successfully..!\n"+result.message,

            });
        });
    }).catch(err => {
        
        // console.log(err); 
        next(createHttpError(500));
    
    });
    // res.json({message: ' here i s i am 2'})
    //console.log(req.body);
}

module.exports={
    postSignup
}