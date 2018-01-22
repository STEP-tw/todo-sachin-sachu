const displayName = function(name) {
  let nameBox = document.getElementById("userName");
  nameBox.innerText += name;
}

const createAnchor = function(href,innerText){
  let anchor = document.createElement('a');
  anchor.href = href;
  anchor.innerText = innerText;
  return anchor;
}

const createListElement = function(){
  let ele = document.createElement("li");
  return ele;
}

const displayTodoTitles = function(todoTitles) {
  let titles = JSON.parse(todoTitles);
  let todoList = document.getElementById('todoLists');
  titles.forEach(todo => {
    let anchor = createAnchor(`/TODO/${todo.key}`,todo.title);
    let element = createListElement();
    element.appendChild(anchor);
    todoList.appendChild(element);
  });
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

const getTodoTitles = () => {
  createRequest("GET","/getTodoTitles",displayTodoTitles);
}

const actionsOnload = function() {
  getNameOfUser();
  getTodoTitles();
}
