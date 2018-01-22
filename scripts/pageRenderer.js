const pageRenderer={};

pageRenderer.removeText=function(pageTemplate,textToremove){
  return pageTemplate.replace(textToremove,'');
};

pageRenderer.addUserName=function(pageTemplate,textToreplace, userName){
  let userNameText=`User: ${userName}`;
  return pageTemplate.replace(textToreplace, userNameText);
};

pageRenderer.addTodoToHomePage=function(pageTemplate,textToreplace,todo){
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
