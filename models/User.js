const { hashSync, compareSync} = require('bcryptjs');

const dbCon  = require('../configuration/db');
const { signupSchema, logSchema } = require('../validator/userValidator');

class User{
    constructor(userData) {
        this.userData = {...userData};
    };

    save(cb) {
        dbCon('users',async (db)=>{
            try {
                const hashedPass = hashSync(this.userData['password'],12);
                this.userData['password'] = hashedPass;
                this.userData['verified'] = false;
                await db.insertOne(this.userData);
                cb();
            } catch (error) {
                console.log(error);
                cb(error);
            }
            
        });
    }

    checkExistence(){
        return new Promise((resolve, reject) => {
            
            dbCon('users', async (db)=>{
                try {
                    const user = await db.findOne({'$or':[{username: this.userData['username']},{email: this.userData['email']}, {phone : this.userData['phone']}]});

                    if (!user) {
                        resolve({
                            check : false
                        });
                    } else if(this.userData['username']=== user.username){
                        resolve({
                            check: true,
                            message : 'This username is already Exists'
                        })
                    } else if(this.userData['email']=== user.email){
                        resolve({
                            check: true,
                            message : 'This email is already registered'
                        })
                    }else if (this.userData['phone'] === user.phone) {
                        resolve({
                            check: true,
                            message : 'This Phone number is already registered'
                        })
                    }
                } catch (error) {
                    reject(error);
                }

            });
        })
    }
    static update(username, password){
        return new Promise((resolve, reject) => {
            dbCon('users', async (db) => {
                try {
                   const res = await db.updateOne({username:username},{'$set':{password : password}});
                   if (res.modifiedCount) {
                       res.message = 'Password Updated Sucessfully';
                   }else{
                       res.message = 'credential not matched..!'
                   }
                   resolve(res);
                } catch (err) {
                    reject(err);
                }
            });
        });
    }
    static validate(userData){
        // const result = 
        //console.log(result.error.message);
        return signupSchema.validate(userData);
        
    }

    static login(userData1){
        return new Promise((resolve,reject)=>{
            //validation
            const validation = logSchema.validate(userData1);
            if (validation.error) {
                const err = new Error(validation.error.message);
                err.statusCode = 400;
                return resolve(err);
            }
            dbCon('users',async(db)=>{
                try {
                    //find User
                    const user = await db.findOne({username: userData1['username']},{projecton:{username: 1, password: 1}});
                    // console.log(compareSync);
                    //console.log(compareSync(userData1['password'], user.password));
                    //console.log(user); 
                    if (!user || !compareSync(userData1['password'], user.password)) {
                        const error = new Error('Please enter valid username or Password');
                        error.statusCode =404;
                        return resolve(error);
                    }
                   
                    resolve(user);
                   // const check = 

                } catch (err) {
                    reject(err);
                }
            });
        });
    }
}

module.exports = User;