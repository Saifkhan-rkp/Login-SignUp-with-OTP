const authRouter = require('./auth');
const resetRouter = require('./resetPswd');

module.exports = (app)=>{
    app.use('/auth',authRouter);
    app.use('',resetRouter);
};
