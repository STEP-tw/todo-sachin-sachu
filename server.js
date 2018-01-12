const fs = require('fs');
const http = require('http');
const queryString=require('querystring');
const PORT = 8888;

const path=(fileName)=> `./webapp/lib/${fileName}`;

const timeStamp = require(path('time.js')).timeStamp;
const WebApp = require(path('webapp.js'));
const Resource=require(path('resourceMetaData.js'));
const handlers=require('./handlers.js').handlers;

let registered_users=JSON.parse(fs.readFileSync('./webapp/data/registeredUsers.txt','utf8'));
let staticResources=[
  '/',
  '/index.html'
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

let loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};

let redirectLoggedOutUserToIndex= (req,res)=>{
  if(req.urlIsOneOf(['/logout']) && !req.user) res.redirect('/index.html');
}

let app = WebApp.create();

app.use(logRequest);
app.use(loadUser);
app.use(redirectLoggedOutUserToIndex);
app.getStatic(staticResources,handlers.getStatic);

app.get('/index.html',handlers.getLogin);
app.post('/login',(req,res)=>{
  let user = registered_users.find(u=>u.userName==req.body.userName);
  if(!user) {
    res.setHeader('Set-Cookie',`logInFailed=true`);
    res.redirect('/index.html');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.write(`UserName: ${user.userName}, Name: ${user.name}`);
  res.end();
});
app.post('/logout',handlers.postLogout);

let server = http.createServer(app);
server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
