const {Router} = require("express");
const {postSignup, postLogin, getVerify, resendOTP, }= require('../controllers');

const router = Router();

router
.post('/login',postLogin)
.get('/signup',(req,res,next )=>{ res.json({message : 'here is i am'})})
.post('/signup', postSignup)
.get('/verify/:id', getVerify)
.get('/resendOTP',resendOTP);

module.exports = router;