const fs=require('fs');
const Resource=require('./resourceMetaData.js');
const ModifyPage=require('./modifyPage.js').ModifyPage;
const querystring=require('querystring');
const TodoApp = require('./models/todoApp.js');
const Handlers={};

const todoApp = new TodoApp(process.env.TESTFILE || "./data/data.json");
todoApp.loadData();

Handlers.loadUser=function(req,res){
  let sessionId = req.cookies.sessionId;
  console.log(sessionId);
  let user = todoApp.getUserBySessionId(sessionId);
  console.log(todoApp.allUsers);
  if(sessionId && user){
    req.user = user;
  }
};

Handlers.redirectLoggedOutUserToIndex= function(req,res){
  let requests=['/index.html','/','/login'];
  if(!req.urlIsOneOf(requests) && !req.user) res.redirect('/index.html');
};

Handlers.redirectLoggedInUserToHome= function(req, res){
  let requests=['/','/index.html'];
  if(req.urlIsOneOf(requests) && req.user) res.redirect('/home.html');
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
    req.url = "/index.html";
  }
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
  res.setHeader('Set-Cookie',[`sessionId=0;Max-Age=-1`]);
  delete req.user.sessionId;
  res.redirect('/index.html');
};

Handlers.serveNameOfUser =(req,res)=>{
  let nameOfUser = req.user.nameOfUser;
  res.write(nameOfUser);
  res.end();
}

Handlers.getAddTodoPage=function(req,res){
  res.setHeader('Content-type','text/html');
  let addTodoTemplate=fs.readFileSync('./webapp/public/template/addTodo.html.template','utf8');
  let addTodoPageSrc=ModifyPage.addUserName(addTodoTemplate,'${USER_NAME}',req.user.userName);
  res.write(addTodoPageSrc);
  res.end();
};

Handlers.saveTodo=function(req,res){
  let todo=querystring.parse(req.queryString);
  let allTodo='[]';
  if(fs.existsSync(`./webapp/data/userData/${req.user.userName}.json`))
    allTodo=fs.readFileSync(`./webapp/data/userData/${req.user.userName}.json`,'utf8');
  let allTodoArray=JSON.parse(allTodo);
  allTodoArray.push(todo);
  fs.writeFileSync(`./webapp/data/userData/${req.user.userName}.json`,JSON.stringify(allTodoArray),'utf8');
  res.redirect('/home');
};

Handlers.viewTodo=function(req,res){
  let todoTitle=querystring.parse(req.queryString).viewTodo;
  let allTodo=fs.readFileSync(`./webapp/data/userData/${req.user.userName}.json`,'utf8');
  let allTodoArray=JSON.parse(allTodo);
  let requiredTodo=allTodoArray.filter(todo=>todo.title==todoTitle)[0];
  let viewTemplate=fs.readFileSync('./webapp/public/template/viewAndEditTodo.html.template','utf8');
  let viewPageSrc=viewTemplate.replace('${TODO_NAME}',requiredTodo.title);
  viewPageSrc=ModifyPage.addUserName(viewPageSrc,'${USER_NAME}',req.user.userName);
  viewPageSrc=ModifyPage.addTodoToViewPage(viewPageSrc,requiredTodo);
  res.write(viewPageSrc);
  res.end();
};

Handlers.serveTodoTitles= function(req,res){
  let todoTitles = JSON.stringify(req.user.getTitlesAndKey());
  debugger;
  res.write(todoTitles);
  res.end();
}

Handlers.deleteTodo=function(req,res){
  let todoName=querystring.parse(req.queryString);
  let allTodo=fs.readFileSync(`./webapp/data/userData/${req.user.userName}.json`,'utf8');
  let allTodoArray=JSON.parse(allTodo);
  let newArray=removeFromArray(allTodoArray,todoName.todoName);
  fs.writeFileSync(`./webapp/data/userData/${req.user.userName}.json`,JSON.stringify(newArray),'utf8');
  res.redirect('/home');
};

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
  todo.items = [];
  let allItemKeys = Object.keys(obj).filter((key)=>key.startsWith("_ITEM_ID_"));
  allItemKeys.forEach((key)=>{
    todo.items.push({text:obj[key],doneStatus:"false"});
  })
  return todo;
}

Handlers.handleNewTodo = function(req, res) {
  let todoObj=querystring.parse(req.queryString);
  let todo=createTodo(todoObj);
  req.user.addNewTodo(todo.title,todo.description,todo.items);
  res.redirect('/home.html');
}

let removeFromArray=function(array,itemToRemove){
  let finalArray=array;
  let index= array.findIndex(item=>item.title==itemToRemove);
  finalArray.splice(index,1);
  return finalArray;
};

exports.Handlers=Handlers;
