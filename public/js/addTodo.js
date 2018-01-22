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

const displayName = function(name) {
  let nameBox = document.getElementById("userName");
  nameBox.innerText += name;
}

const createRequest = function(method,url,callBack){
  let req = new XMLHttpRequest();
  req.onreadystatechange = function(){
    if (this.readyState == 4) {
      callBack(this.responseText);
    }
  }
  req.open(method,url);
  req.send();
}

const getNameOfUser = () => {
  createRequest("GET","/getNameOfUser",displayName);
}
