let modifyHomePage=function(){
}

modifyHomePage.prototype={
  removeText:function(homePageTemplate,textToremove){
    return homePageTemplate.replace(textToremove,'');
  },

  addUserName:function(homePageTemplate,textToreplace, userName){
    let userNameText=`User: ${userName}`;
    return homePageTemplate.replace(textToreplace, userNameText);
  },

  // addCommentsToGuestPage:function(homePageTemplate,textToreplace,commentFileContent){
  //   let comments=JSON.parse(commentFileContent);
  //   let pageSource='';
  //   pageSource+=comments.reverse().reduce((acc,comment)=>{
  //     let commentRow=`<div>`;
  //     commentRow+=`Date: ${comment.date}<br>`;
  //     commentRow+=`Name: ${comment.name}<br>`;
  //     commentRow+=`Comment: ${comment.comment}<br><br></div>`;
  //     acc+=commentRow;
  //     return acc;
  //   },'');
  //   return homePageTemplate.replace(textToreplace,pageSource);
  // }
}

module.exports=modifyHomePage;
