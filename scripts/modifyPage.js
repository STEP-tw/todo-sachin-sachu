const ModifyPage={};

ModifyPage.removeText=function(pageTemplate,textToremove){
  return pageTemplate.replace(textToremove,'');
};

ModifyPage.addUserName=function(pageTemplate,textToreplace, userName){
  let userNameText=`User: ${userName}`;
  return pageTemplate.replace(textToreplace, userNameText);
};

ModifyPage.addTodoToHomePage=function(pageTemplate,textToreplace,todo){
  let todoArray=JSON.parse(todo);
  let pageSource='<div>';
  pageSource+=todoArray.map((todoObj)=>{
    return `<div><form method="POST" action="viewTodo">
    <input type="submit" name="viewTodo" value="${todoObj.title}"></input>
    </form></div><div>${todoObj.title}</div><br>`;
  }).join('');
  pageSource+='</div>';
  return pageTemplate.replace(textToreplace,pageSource);
};

ModifyPage.addTodoToViewPage=function(pageTemplate,todoObj){
  let pageSrc=pageTemplate.replace('${TODO_TITLE}',todoObj.title);
  pageSrc=pageSrc.replace('${TODO_DESCRIPTION}',todoObj.description);
  let todoIds=Object.keys(todoObj).filter(key=>key.startsWith('_ITEM_ID_'))
  let todoItems='<ul>';
  todoItems+=todoIds.map((item)=> `<li>${todoObj[item]}</li>`).join('')+'</ul>';
  return pageSrc.replace('${TODO_ITEMS}',`<div>${todoItems}</div>`);
};

exports.ModifyPage=ModifyPage;
