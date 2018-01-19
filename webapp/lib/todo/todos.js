const Todo=require('./todo.js');

class Todos{
  constructor(key=0){
    this.key=key;
    this.todoKey=0;
    this.todos={}
  }
  get todosKey(){
    return this.todoKey;
  }
  get getTodos(){
    return this.todos;
  }
  get totalTodos(){
    return Object.keys(this.todos).length;
  }
  addNewTodo(title,description,todoItemList=[]){//tested
    this.todos[++this.todoKey]=new Todo(title,description,todoItemList,this.todoKey);
    return this.todoKey;
  }
  getTodo(key){//tested
    return this.todos[key];
  }
  getTodoTitle(key){//tested
    if(!this.todos[key]) return undefined;
    return this.todos[key].getTitle;
  }
  getTodoDescription(key){//tested
    if(!this.todos[key]) return undefined;
    return this.todos[key].getDescription;
  }
  addTodoItem(key,itemText,doneStatus=false){//tested
    if(!this.todos[key]) return undefined;
    return this.todos[key].addItem(itemText,doneStatus);
  }
  getTodoItems(key){//tested
    if(!this.todos[key]) return undefined;
    return this.todos[key].getTodoItems;
  }
  removeTodo(key){//tested
    if(!this.todos[key]) return false;
    delete this.todos[key];
    return true;
  }
  removeTodoItem(todoKey,itemKey){
    if(!this.todos[todoKey]) return false;
    return this.removeSpecificItem(itemKey);
  }
}

module.exports=Todos;
