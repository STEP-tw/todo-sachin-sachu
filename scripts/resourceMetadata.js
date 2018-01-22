
const getFileExtention=function(resourceName){
  return resourceName.split('.')[1];
};

const Resource=function(resourceName){
  this.resourceName=resourceName;
};

Resource.prototype.getContentType=function(){
  return contentTypes[getFileExtention(this.resourceName)] || "text/html";
};

const filePaths={
  '/':'./webapp/public/doc/index',
  '/index':'./webapp/public/doc/index',
  '/js/newTodoItem.js': './webApp/public/js/newTodoItem.js',
  'registeredUsers.json': './webApp/data/registeredUsers.json'
};

const contentTypes={
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
