const fs=require('fs');
const path=(fileName)=>`./webapp/lib/${fileName}`;
const Resource=require(path('resourceMetaData.js'));
const registeredUsers=new Resource('registeredUsers.txt');
const ModifyGuestbook=require(path('modifyGuestbook.js'));
const saveComments=require(path('saveComments.js')).saveComments;

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
  res.redirect('/guestBook.html');
};

handlers.postLogout=function(req,res){
  res.setHeader('Set-Cookie',[`loginFailed=false,Expires=${new Date(1).toUTCString()}`,`sessionid=0,Expires=${new Date(1).toUTCString()}`]);
  delete req.user.sessionid;
  res.redirect('/guestBook.html');
};

exports.handlers=handlers;
