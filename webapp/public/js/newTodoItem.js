let id=0;

const addTodoItem=function(){
  let todoField=document.getElementById('newTodoItem');
  let newList=document.createElement('div');
  let newItem=document.createElement('input');
  newItem.setAttribute("name",`_ITEM_ID_${++id}`);
  newItem.setAttribute("id",`_ITEM_ID_${id}`);
  newList.appendChild(newItem);
  todoField.appendChild(newList);
};
