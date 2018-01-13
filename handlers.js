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
  let todoContent='[]';
  if(fs.existsSync(`./webapp/data/${req.user.userName}.txt`))
    todoContent =fs.readFileSync(`./webapp/data/${req.user.userName}.txt`,'utf8');
  if(Object.keys(todoContent).length==0)
  homePageSrc=modifyHomePage.removeText(homePageSrc,'${TODO}');
  else homePageSrc=modifyHomePage.addTodoToHomePage(homePageSrc,'${TODO}',todoContent);
  console.log(JSON.parse(todoContent));
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
  let allTodo='[]';
  if(fs.existsSync(`./webapp/data/${req.user.userName}.txt`))
    allTodo=fs.readFileSync(`./webapp/data/${req.user.userName}.txt`,'utf8');
  let allTodoArray=JSON.parse(allTodo);
  allTodoArray.push(todo);
  fs.writeFileSync(`./webapp/data/${req.user.userName}.txt`,JSON.stringify(allTodoArray),'utf8');
  console.log(todo);
  res.redirect('/home');
};

handlers.viewTodo=function(req,res){
  let todoTitle=querystring.parse(req.queryString).viewTodo;
  let allTodo=fs.readFileSync(`./webapp/data/${req.user.userName}.txt`,'utf8');
  let allTodoArray=JSON.parse(allTodo);
  let requiredTodo=allTodoArray.filter(todo=>todo.title==todoTitle)[0];
  let viewTemplate=fs.readFileSync('./webapp/public/template/viewAndEditTodo.html.template','utf8');
  let modifyPage=new ModifyPage();
  let viewPageSrc=modifyPage.addUserName(viewTemplate,'${USER_NAME}',req.user.userName);
  viewPageSrc=modifyPage.addTodoToViewPage(viewPageSrc,requiredTodo);
  res.write(viewPageSrc);
  res.end();
};

exports.handlers=handlers;
