const fs=require('fs');
const path=(fileName)=>`./webapp/lib/${fileName}`;
const Resource=require(path('resourceMetaData.js'));
const registeredUsers=new Resource('registeredUsers.txt');
const ModifyPage=require(path('modifyPage.js'));
const querystring=require('querystring');
const handlers={}

handlers.getStatic=function(req,res){
  let resource=new Resource(req.url);
  res.setHeader('Content-type',resource.getContentType());
  let content=fs.readFileSync(resource.getFilePath(),resource.getEncoding());
  res.write(content);
  res.end();
};

handlers.getIndex=function(req,res){
  res.setHeader('Content-type','text/html');
  if(req.cookies.logInFailed) res.write('<p>logIn Failed</p>');
  let login=new Resource('/index.html');
  res.write(fs.readFileSync(login.getFilePath(),login.getEncoding()));
  res.end();
};

handlers.postLogin=function(req,res){
  let registered_users=JSON.parse(fs.readFileSync(registeredUsers.getFilePath(), registeredUsers.getEncoding()));
  let user = registered_users.find(u=>u.userName==req.body.userName);
  if(!user) {
    res.setHeader('Set-Cookie',`logInFailed=true`);
    res.redirect('/index.html');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/home');
};

handlers.getHome=function(req,res){
  res.setHeader('Content-type','text/html');
  let homeTemplate=fs.readFileSync('./webapp/public/template/home.html.template','utf8');
  let modifyHomePage=new ModifyPage();
  let homePageSrc=modifyHomePage.addUserName(homeTemplate,'${USER_NAME}',req.user.userName);
  res.write(homePageSrc);
  res.end();
};

handlers.postLogout=function(req,res){
  res.setHeader('Set-Cookie',[`loginFailed=false,Expires=${new Date(1).toUTCString()}`,`sessionid=0,Expires=${new Date(1).toUTCString()}`]);
  delete req.user.sessionid;
  res.redirect('/index.html');
};

handlers.getAddTodoPage=function(req,res){
  res.setHeader('Content-type','text/html');
  let addTodoTemplate=fs.readFileSync('./webapp/public/template/addTodo.html.template','utf8');
  let modifyAddTodoPage=new ModifyPage();
  let addTodoPageSrc=modifyAddTodoPage.addUserName(addTodoTemplate,'${USER_NAME}',req.user.userName);
  res.write(addTodoPageSrc);
  res.end();
};

handlers.saveTodo=function(req,res){
  console.log(req.queryString);
  let todo=querystring.parse(req.queryString);
  let allTodo=fs.readFileSync(`./webapp/data/${req.user.userName}.txt`,'utf8');
  let allTodoObj=JSON.parse(allTodo);
  allTodoObj[todo.title]=todo;
  fs.writeFileSync(`./webapp/data/${req.user.userName}.txt`,JSON.stringify(allTodoObj),'utf8');
  console.log(todo);
  res.redirect('/home');
};

exports.handlers=handlers;
