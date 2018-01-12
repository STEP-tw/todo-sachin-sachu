const queryString=require('querystring');
const fs=require('fs');
const Resource=require('./resourceMetaData.js');

const makeCommentObject=(querystring, dateAndTime)=>{
  console.log(querystring);
  let commentObj=queryString.parse(querystring);
  commentObj.date=dateAndTime;
  return commentObj;
};

const saveComments=function(req){
  console.log('saving comments');
  let dateAndTime=new Date().toLocaleString();
  let commentObj=new Resource('comments.txt');
  let comments=JSON.parse(fs.readFileSync(commentObj.getFilePath(),commentObj.getEncoding()));
  comments.push(makeCommentObject(req.queryString,dateAndTime));
  fs.writeFileSync(commentObj.getFilePath(),JSON.stringify(comments));
};

exports.saveComments=saveComments;
