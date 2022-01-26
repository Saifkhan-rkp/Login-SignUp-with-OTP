require('dotenv').config();
const http = require('http');
const { Server } = require('https');
const app = require('./app');

const server = http.createServer(app);

server.listen(process.env.PORT, () =>{
    console.log(`Server is On..!\n link http://localhost:${process.env.PORT}`);
})
