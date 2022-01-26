const createHttpError = require('http-errors');
const jwt = require('jsonwebtoken');
const logger = require('../../configuration/logger');
const {User} =require('../../models');
const {readFileSync}= require('fs');


const getLogin = ((req,res,next)=>{
    logger.info('hey');
    res.send('well come to login page');
});

const postLogin = (req,res,next)=>{
    
    // console.log(req.body);
    User.login(req.body).then(result =>{
        if (result instanceof Error) {
            return next(result);
        }
        const secretK = readFileSync('./private.key');
        const token = jwt.sign({_id: result._id,username: result.username},secretK,{
            expiresIn:'24h'
        });
        res.json({token});
    }).catch(err=>{
        next(createHttpError(500));
    })
};

module.exports ={
    getLogin,
    postLogin
};