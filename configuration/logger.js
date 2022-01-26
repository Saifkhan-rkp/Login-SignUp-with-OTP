const {createLogger,transports} = require('winston');

const infoLogger =createLogger({
    transports:[
        new transports.File({
            filename:'./logs/infoLogs.log',
            level:'info'
        })
    ]
});
//this URL is valid upto 1 Week from 25 JAN 2022

infoLogger.stream ={
    write : (message, encoding)=>{
        infoLogger.info(message);
    }
}

module.exports = infoLogger;