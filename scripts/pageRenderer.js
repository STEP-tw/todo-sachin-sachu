const DOMHelpers=require('./DOMHelpers.js');
const pageRenderer={};

pageRenderer.removeText=function(pageTemplate,textToremove){
  return pageTemplate.replace(textToremove,'');
};

pageRenderer.addUserName=function(pageTemplate,textToreplace, userName){
  let userNameText=`User: ${userName}`;
  return pageTemplate.replace(textToreplace, userNameText);
};

pageRenderer.addTodoToViewPage=function(pageTemplate,todoObj){
  let pageSrc=pageTemplate.replace('${TODO_TITLE}',todoObj.title);
  pageSrc=pageSrc.replace('${TODO_DESCRIPTION}',todoObj.description);
  let todoIds=Object.keys(todoObj.items);
  let list=`<ol>`;
  todoIds.forEach((key)=>{
    let item = todoObj.items[key];
    let checkbox = DOMHelpers.createCheckbox(item.key,item.doneStatus);
    let listItem = DOMHelpers.createListItem(item.key,item.text);
    list+= DOMHelpers.insertChild(listItem,"CHECKBOX",checkbox);
  });
  list+=`</ol>`;
  return pageSrc.replace('${TODO_ITEMS}',list);
};

module.exports=pageRenderer;
