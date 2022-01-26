const  dbCon  = require("../configuration/db");

class Otp {
    constructor() {
        
    }
    static save(otp, res) {
        return new Promise((resolve, reject) => {
            let otpData = {
                otp: otp,
                expiration_time: new Date(new Date().getTime() + 20 * 60000),
                verified: false,
                fromService: res,
                creted_At: new Date(),
                updated_At: new Date(),
            };
            dbCon('OTP', async (db) => {
                try {
                   const res = await db.insertOne(otpData); 
                   resolve(res);
                } catch (err) {
                    reject(err);
                }
                
            });
        });
            
    }
    static update(id,otp,username) {
        return new Promise((resolve, reject) => {
                dbCon('OTP', async (db, db2) => {
                    try {
                        let tempres = {check:false};
                        const res = await db.findOne({_id:id},{projection : {otp:1,expiration_time:1}}); //,{'$set': {verified:true}, '$currentDate': {updated_At: true}}
                        // console.log(res);
                        if (!res) {
                            tempres.message = 'Invalid url';
                        }else if(new Date() >= res.expiration_time){
                            tempres.check = false ;
                            tempres.message = 'OTP Expired';
                        }else if (res.otp == otp) {
                            tempres = await db.updateOne({_id:id},{'$set':{verified: true}, '$currentDate': {updated_At: true}});
                            if(tempres.modifiedCount)
                                tempres.check = true;
                        }else{
                            resolve({
                                check:false,
                                message : 'OTP is not matched, please enter correct otp'
                            });
                        }
                        
                        if (tempres.check) {
                            tempres = await db2.updateOne({username},{'$set':{verified : true}});
                            if(tempres.modifiedCount){
                               tempres.check = true; 
                               tempres.message = 'User verified successfully';
                            }
                                
                            // console.log(tempres);
                        }
                        resolve(tempres);
                    } catch (err) {
                        console.log(err);
                        reject(err);
                    }

                }, 'users');
        });

    }
};

module.exports = Otp;