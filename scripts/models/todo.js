const TodoItem=require('./todoItem.js');
class Todo{
  constructor(title='',description='',list=[],key=0){
    this.key=key;
    this.itemKey=0;
    this.title=title;
    this.description=description;
    this.items={};
    list.forEach(item=>this.items[++this.itemKey]=new TodoItem(item,this.itemKey));
  }
  get getKey(){
    return this.key;
  }
  get getTitle(){
    return this.title;
  }
  get getDescription(){
    return this.description;
  }
  get getTodoItems(){
    return this.items;
  }
  get getTitleAndKey(){
    return {
      title:this.title,
      key:this.key
    };
  }
  set newTitle(_newTitle){
    this.title=_newTitle;
  }
  set newDescription(description){
    this.description=description;
  }
  getSpecificItem(key){
    return this.items[key];
  }
  removeSpecificItem(itemKey){
    if(!this.items[itemKey]) return false;
    delete this.items[itemKey];
    return true;
  }
  addItem(todoText,doneStatus=false){
    if(todoText){
      this.items[++this.itemKey]=new TodoItem(todoText,this.itemKey,doneStatus);
      return true;
    }
    return false;
  }
  editItem(itemKey,newTodoItemText){
    if(newTodoItemText && this.items[itemKey]){
      this.items[itemKey].todoText=newTodoItemText;
      return true;
    }
    return false;
  }
  markAsDone(itemKey){
    if(!this.items[itemKey]) return false;
    this.items[itemKey].setAsDone();
    return true;
  }
  markAsUndone(itemKey){
    if(!this.items[itemKey]) return false;
    this.items[itemKey].setAsUndone();
    return true;
  }
}
module.exports=Todo;
