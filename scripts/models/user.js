const Todo=require('./todo.js');

class User{
  constructor(name,userId,password,key=0){
    this.name=name;
    this.userId=userId;
    this.password=password;
    this.key=key;
    this.todoKey=0;
    this.todos=[]
  }

  get getTodos(){
    return this.todos;
  }
  get totalTodos(){
    return this.todos.length;
  }
  get nameOfUser(){
    return this.name;
  }
  getTitlesAndKey(){
    return this.todos.map(todo=>todo.getTitleAndKey);
  }
  addNewTodo(title,description,todoItemList=[]){//tested
    this.todos.push(new Todo(title,description,todoItemList,++this.todoKey));
    return this.todoKey;
  }
  getTodo(key){//tested
    return this.todos.find(todo=>todo.key==key);
  }

  getTodoTitle(key){//tested
    let todo=this.getTodo(key)
    if(!todo) return undefined;
    return todo.getTitle;
  }
  getTodoDescription(key){//tested
    let todo=this.getTodo(key)
    if(!todo) return undefined;
    return todo.getDescription;
  }
  addTodoItem(key,itemText,doneStatus=false){//tested
    let todo=this.getTodo(key)
    if(!todo) return undefined;
    return todo.addItem(itemText,doneStatus);
  }
  getTodoItems(key){//tested
    let todo=this.getTodo(key)
    if(!todo) return undefined;
    return todo.getTodoItems;
  }
  removeTodo(key){//tested
    let todoIndex=this.todos.findIndex(todo=>todo.key==key);
    if(todoIndex<0) return undefined;
    this.todos.splice(todoIndex,1);
    return true;
  }
  removeTodoItem(todoKey,itemKey){ //remain to test
    let todo=this.getTodo(todoKey)
    if(!todo) return false;
    return todo.removeSpecificItem(itemKey);
  }
  addSessionId(sessionId){
    this.sessionId = sessionId;
  }
  isSameSessionID(sessionId){
    return this.sessionId == sessionId;
  }
  loadData(todos){
    todos.forEach(todo=>{
      let newTodo = new Todo(todo.title,todo.description,[],++this.todoKey);
      newTodo.loadData(todo.items);
      this.todos.push(newTodo);
    });
  }
}

module.exports=User;
