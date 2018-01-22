const pageRenderer={};

pageRenderer.removeText=function(pageTemplate,textToremove){
  return pageTemplate.replace(textToremove,'');
};

pageRenderer.addUserName=function(pageTemplate,textToreplace, userName){
  let userNameText=`User: ${userName}`;
  return pageTemplate.replace(textToreplace, userNameText);
};

pageRenderer.addTodoToViewPage=function(pageTemplate,todoObj){
  debugger;
  let pageSrc=pageTemplate.replace('${TODO_TITLE}',todoObj.title);
  pageSrc=pageSrc.replace('${TODO_DESCRIPTION}',todoObj.description);
  let todoIds=Object.keys(todoObj.items);
  let todoItems='<ul>';
  todoIds.forEach((key)=>{
    let item = todoObj.items[key];
    todoItems+=`<li id="${item.key}">${item.text}</li>`;
  });
  todoItems+='</ul>';
  return pageSrc.replace('${TODO_ITEMS}',`<div>${todoItems}</div>`);
};

module.exports=pageRenderer;
