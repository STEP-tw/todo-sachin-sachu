const fs=require('fs');
const Resource=require('./resourceMetaData.js');
const querystring=require('querystring');
const TodoApp = require('./models/todoApp.js');
const pageRenderer = require('./pageRenderer.js');
const Handlers={};

const todoApp = new TodoApp(process.env.TESTFILE || "./data/data.json");
todoApp.loadData();

Handlers.loadUser=function(req,res){
  let sessionId = req.cookies.sessionId;
  let user = todoApp.getUserBySessionId(sessionId);
  if(sessionId && user){
    req.user = user;
  }
};

Handlers.redirectLoggedOutUserToIndex= function(req,res){
  let requests=['/index','/','/login'];
  if(!req.urlIsOneOf(requests) && !req.user) res.redirect('/index');
};

Handlers.redirectLoggedInUserToHome= function(req, res){
  let requests=['/','/index'];
  if(req.urlIsOneOf(requests) && req.user) res.redirect('/home');
};

Handlers.getStatic=function(req,res){
  if (fs.existsSync(`./public${req.url}`)) {
    let resource=new Resource(req.url);
    res.setHeader('Content-type',resource.getContentType());
    let content=fs.readFileSync(`./public${req.url}`);
    res.write(content);
    res.end();
  }
};

Handlers.handleSlash = (req,res)=>{
  if (req.url == "/") {
    req.url = "/index";
  }
}

Handlers.handleLogin=function(req,res){
  if(!todoApp.isValidUser(req.body.userId,req.body.password)) {
    res.setHeader('Set-Cookie',`logInFailed=true; Max-Age=5`);
    res.redirect('/index');
    return;
  }
  let sessionId = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionId=${sessionId}`);
  todoApp.addSessionIdTo(req.body.userId,sessionId)
  res.redirect('/home');
};

Handlers.handleLogout=function(req,res){
  res.setHeader('Set-Cookie',`sessionId=0; Max-Age=-1`);
  delete req.user.sessionId;
  res.redirect('/index');
};

Handlers.serveNameOfUser =(req,res)=>{
  let nameOfUser = req.user.nameOfUser;
  res.write(nameOfUser);
  res.end();
}

Handlers.serveTodoTitles= function(req,res){
  let todoTitles = JSON.stringify(req.user.getTitlesAndKey());
  debugger;
  res.write(todoTitles);
  res.end();
}

Handlers.fileNotFound = function(req,res){
  if (!res.finished) {
    res.statusCode = 404;
    let errorMessage=`Oops... File not found!!\nYou tried to access "${req.url}"`;
    res.write(errorMessage);
    res.end();
  }
}

const createTodo = function(obj){
  let todo = {};
  todo.title = obj.title;
  todo.description = obj.description;
  let allItemKeys = Object.keys(obj).filter((key)=>key.startsWith("_ITEM_ID_"));
  todo.items = allItemKeys.map((key)=>obj[key]);
  return todo;
}

Handlers.handleNewTodo = function(req, res) {
  let todoObj=querystring.parse(req.queryString);
  let todo=createTodo(todoObj);
  req.user.addNewTodo(todo.title,todo.description,todo.items);
  res.redirect('/home');
}

Handlers.handleViewTodo=function(req,res){
  let todo = req.user.getTodo(req.todoId);
  if (todo) {
    let pageTemplate = fs.readFileSync('./public/template/viewAndEditTodo.html.template','utf8');
    let pageWithName = pageRenderer.addUserName(pageTemplate,'${USER_NAME}',req.user.name);
    let dataToServe = pageRenderer.addTodoToViewPage(pageWithName,todo);
    res.writeHead(200,{"Content-type":"text/html"})
    res.write(dataToServe)
    res.end();
  }
}

Handlers.sanitiseShowTodoUrl = function(req,res){
  if(req.url.startsWith('/TODO')){
    let urlContents = req.url.split("/");
    req.url = `/${urlContents[1]}`;
    req.todoId = urlContents[2];
  }
}
exports.Handlers=Handlers;
