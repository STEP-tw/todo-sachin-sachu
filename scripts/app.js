const fs = require('fs');
const http = require('http');
const PORT = 8888;

const path=(fileName)=> `./webapp/lib/${fileName}`;

const timeStamp = require('./time.js').timeStamp;
const WebApp = require('./webapp.js');
const Resource=require('./resourceMetaData.js');
const Handlers=require('./handlers.js').Handlers;

let staticResources=[
  '/',
  '/index.html',
  '/newTodoItem.js'
];

let toS = o=>JSON.stringify(o,null,2);

let logRequest = (req,res)=>{
  let text = ['------------------------------',
  `${timeStamp()}`,
  `${req.method} ${req.url}`,
  `HEADERS=> ${toS(req.headers)}`,
  `COOKIES=> ${toS(req.cookies)}`,
  `BODY=> ${toS(req.body)}`,''].join('\n');
  fs.appendFile('request.log',text,()=>{});

  console.log(`${req.method} ${req.url}`);
}


let app = WebApp.create();

app.preUse(logRequest);
app.preUse(Handlers.loadUser);
app.preUse(Handlers.redirectLoggedInUserToHome);
app.preUse(Handlers.redirectLoggedOutUserToIndex);
app.preUse(Handlers.handleSlash);
app.get("/getName",Handlers.serveNameOfUser);
app.get("/logout",Handlers.handleLogout);
app.post("/login",Handlers.handleLogin)
app.postUse(Handlers.getStatic);
app.postUse(Handlers.fileNotFound);

module.exports=app;
