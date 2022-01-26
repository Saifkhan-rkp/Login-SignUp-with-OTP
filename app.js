const express = require('express');
const createError = require('http-errors');
const { logger } = require('./configuration');
const routes = require('./routes');
const bodyParser = require('body-parser');
const {middleware} = require('./middleware');

const app = express();

process.on('unhandledRejection',(reason) =>{
    logger.error(reason);
    process.exit(1);
});
 
middleware(app);
//route Declaration
routes(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use((req, res, next) => {
    const error = createError(404);
    next(error);
});

app.use((error, req, res, next)=>{
    logger.error(error.message);
    res.statusCode = error.statusCode;
    res.json({
        message : error.message
    });
});

module.exports = app;