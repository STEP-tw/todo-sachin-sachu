const fs = require('fs');
const http = require('http');
const PORT = 8888;

const path=(fileName)=> `./webapp/lib/${fileName}`;

const timeStamp = require(path('time.js')).timeStamp;
const WebApp = require(path('webapp.js'));
const Resource=require(path('resourceMetaData.js'));
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

app.use(logRequest);
app.use(Handlers.loadUser);
app.use(Handlers.redirectLoggedInUserToHome);
app.use(Handlers.redirectLoggedOutUserToIndex);
app.getStatic(staticResources,Handlers.getStatic);
app.get('/index.html',Handlers.getIndex);
app.post('/login',Handlers.postLogin);
app.get('/home',Handlers.getHome);
app.get('/addTodo',Handlers.getAddTodoPage);
app.get('/viewTodo',Handlers.getTodo);
app.post('/logout',Handlers.postLogout);
app.post('/saveNewTodo',Handlers.saveTodo);
app.post('/viewTodo',Handlers.viewTodo);
app.post('/deleteTodo',Handlers.deleteTodo);

module.exports=app;
