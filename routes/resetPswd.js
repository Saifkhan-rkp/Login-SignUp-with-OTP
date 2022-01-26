const {Router} = require("express");
const { postReq, resetPassword } = require('../controllers');

const router = Router();

router
.post('/forgetPassword',postReq)
.post('/resetPassword/:id', resetPassword);

module.exports = router;