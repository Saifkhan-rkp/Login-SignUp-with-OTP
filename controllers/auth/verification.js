
const jwt = require('jsonwebtoken');
const { readFileSync } = require('fs');

const {ObjectId} = require('bson');
const { Otp } = require('../../models');
const createHttpError = require('http-errors');
const secretK = readFileSync('./private.key');

//Note: JWT token is valid upto 1hr
const getVerify =(req,res,next)=>{
    let token = req.query.token;
    const decoded = jwt.verify(token,secretK);
    const otp = req.query.value;
    const id = new ObjectId(req.params.id);
    if (!ObjectId.isValid(req.params.id)) {
        next(createHttpError(409));
    }
    // console.log(req.params.id,id,otp,decoded['username']);
    Otp.update(id,otp,decoded['username']).then(result =>{
        // console.log(result);
        if(result.check){
            res.json({
                message : result.message
            });
        
        }else {
            res.json({message : result.message})
        }
            
    }).catch(err => { 
        //console.log(err); 
        next(createHttpError(500));
    });

};

module.exports = {
    getVerify
}

/**
 * const token = req.query['token'];
    try {
        const decoded = jwt.verify(token,secretK);
        dbCon('users', async (db) =>{
           
            const modifiedDoc = await db.updateOne({username: decoded['username']},{'$set':{ verified : true}});
            if (modifiedDoc.modifiedCount === 0) {
                return next(createHttpError(404));
            }
            res.json({
                message : 'your account has been verified..!'
            })
        });
        
    } catch (err) {
      next(createHttpError(400));  
    }
 */