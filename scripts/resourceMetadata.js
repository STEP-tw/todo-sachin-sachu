const Resource=function(resourceName){
  this.resourceName=resourceName;
};

Resource.prototype.getEncoding=function(){
  return encoding[getFileExtention(this.resourceName)];
};

Resource.prototype.getContentType=function(){
  return contentTypes[getFileExtention(this.resourceName) || "text/html"];
};

Resource.prototype.getFilePath=function(){
  return filePaths[this.resourceName];
};

const getFileExtention=function(resourceName){
  return resourceName.split('.')[1];
};

const filePaths={
  '/':'./webapp/public/doc/index.html',
  '/index.html':'./webapp/public/doc/index.html',
  '/js/newTodoItem.js': './webApp/public/js/newTodoItem.js',
  'registeredUsers.json': './webApp/data/registeredUsers.json'
};

const contentTypes={
  undefined:'text/html',
  'html':'text/html',
  'css': 'text/css',
  'js': 'text/javascript',
  'gif': 'image/gif',
  'jpg': 'image/jpg',
  'ico': 'image/ico',
  'pdf': 'application/pdf'
};

const encoding={
  undefined:'utf8',
  'html':'utf8',
  'css': 'utf8',
  'js': 'utf8',
  'txt': 'utf8',
  'ico':undefined,
  'gif': undefined,
  'jpg': undefined,
  'pdf': undefined
};

module.exports=Resource;
