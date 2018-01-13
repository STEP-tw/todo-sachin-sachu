const http = require('http');
const PORT = 8888;

const app=require('./app.js');

let server = http.createServer(app);
server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
