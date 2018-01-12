let modifyPage=function(){
}

modifyPage.prototype={
  removeText:function(homePageTemplate,textToremove){
    return homePageTemplate.replace(textToremove,'');
  },

  addUserName:function(homePageTemplate,textToreplace, userName){
    let userNameText=`User: ${userName}`;
    return homePageTemplate.replace(textToreplace, userNameText);
  },

  addTodoToHomePage:function(homePageTemplate,textToreplace,todo){
    let todoArray=JSON.parse(todo);
    let pageSource='<div>';
    pageSource+=todoArray.map((todoObj)=>{
      return `<div><form method="POST" action="viewTodo">
      <input type="submit" name="viewTodo" value="view"></input>
      </form></div><div>${todoObj.title}</div><br>`;
    }).join('');
    pageSource+='</div>';
    console.log(pageSource);
    return homePageTemplate.replace(textToreplace,pageSource);
  }
}

module.exports=modifyPage;
