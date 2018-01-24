const fs = require('fs');
const http = require('http');
const express = require('express');
const cookieParser = require('cookie-parser');
const PORT = 8888;

const timeStamp = require('./time.js').timeStamp;
const Resource=require('./resourceMetaData.js');
const Handlers=require('./handlers.js').Handlers;

const app = express();

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



// let app = WebApp.create();

// app.use(logRequest);
app.use(cookieParser());
app.use(cookieParser());
app.use(express.urlencoded({extended:"false"}));
app.use(Handlers.loadUser);
app.use(Handlers.redirectLoggedInUserToHome);
app.use(Handlers.redirectLoggedOutUserToIndex);
app.use("/",Handlers.handleSlash);
app.use(express.static('public'));
app.use(Handlers.sanitiseShowTodoUrl);
app.get('/getTodoTitles',Handlers.serveTodoTitles);
app.get("/getNameOfUser",Handlers.serveNameOfUser);
app.get("/logout",Handlers.handleLogout);
app.get("/TODO",Handlers.handleViewTodo);
app.post("/login",Handlers.handleLogin);
app.post("/saveNewTodo",Handlers.handleNewTodo);
app.post("/UPDATESTATUS",Handlers.handleUpdateItemStatus);
app.delete("/DELETE",Handlers.handleDeletingTodo);

module.exports=app;
