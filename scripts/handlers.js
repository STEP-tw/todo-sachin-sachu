const fs=require('fs');
const Resource=require('./resourceMetaData.js');
const querystring=require('querystring');
const TodoApp = require('./models/todoApp.js');
const pageRenderer = require('./pageRenderer.js');
const Handlers={};

const todoApp = new TodoApp(process.env.TESTFILE || "./data/data.json");
todoApp.loadData();

Handlers.loadUser=function(req,res,next){
  let sessionId = req.cookies.sessionId;
  let user = todoApp.getUserBySessionId(sessionId);
  if(sessionId && user){
    req.user = user;
  }
  next();
};

Handlers.redirectLoggedOutUserToIndex= function(req,res,next){
  let requests=['/index.html','/','/login'];
  if(!requests.includes(req.url) && !req.user)
    res.redirect('/index.html');
    else next();
};

Handlers.redirectLoggedInUserToHome= function(req, res,next){
  let requests=['/','/index.html'];
  if(requests.includes(req.url) && req.user)
  res.redirect('/home.html');
  else next();
};

Handlers.handleSlash = (req,res,next)=>{
  if(req.url=='/'){
    req.url = "/index.html";
  }
  next();
}

Handlers.handleLogin=function(req,res){
  if(!todoApp.isValidUser(req.body.userId,req.body.password)) {
    res.setHeader('Set-Cookie',`logInFailed=true; Max-Age=5`);
    res.redirect('/index.html');
    return;
  }
  let sessionId = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionId=${sessionId}`);
  todoApp.addSessionIdTo(req.body.userId,sessionId)
  res.redirect('/home.html');
};

Handlers.handleLogout=function(req,res){
  res.setHeader('Set-Cookie',`sessionId=0; Max-Age=-1`);
  delete req.user.sessionId;
  res.redirect('/index.html');
};

Handlers.serveNameOfUser =(req,res)=>{
  let nameOfUser = req.user.nameOfUser;
  res.write(nameOfUser);
  res.end();
}

Handlers.serveTodoTitles= function(req,res){
  let todoTitles = JSON.stringify(req.user.getTitlesAndKey());
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
  res.redirect('/home.html');
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

Handlers.handleDeletingTodo = function(req,res){
  let todo = req.user.getTodo(req.todoId);
  if(todo){
    let deletionStatus = req.user.removeTodo(req.todoId);
    res.write(`${deletionStatus}`);
    res.end();
  }
}

Handlers.handleUpdateItemStatus=function(req,res){
  let todo = req.user.getTodo(req.todoId);
  if(todo){
    todo.updateAllItemsStatus(req.body);
    res.write("true");
    res.end();
  }
}

Handlers.sanitiseShowTodoUrl = function(req,res,next){
  if(startsWithAny(req.url,['/TODO/','/DELETE','/UPDATESTATUS'])){
    let urlContents = req.url.split("/");
    req.url = `/${urlContents[1]}`;
    req.todoId = urlContents[2];
  }
  next();
}

const startsWithAny=function(url,list){
  return list.some(urlBase=>url.startsWith(urlBase));
}
exports.Handlers=Handlers;
