let i=0;
const addTodoItem=function(){
  let todoField=document.getElementById('newTodoItem');
  let newList=`<div><input type="text" name="${++i}"></div>`
  todoField.innerHTML+=newList;
};
const loadButton=function(){
  document.getElementById('addNewList').addEventListener("click",addTodoItem);
};

window.onload=loadButton;
