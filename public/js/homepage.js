const displayName = function(name) {
  let nameBox = document.getElementById("userName");
  nameBox.innerText += name;
}

const displayTodoTitles = function(todoTitles) {
  let titles = JSON.parse(todoTitles);
  let todoList = document.getElementById('todoLists');
  titles.forEach(todo => {
    let anchor = document.createElement('a');
    anchor.href = `TODO/${todo.key}`;
    anchor.innerText = todo.title;
    todoList.appendChild(anchor);
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
