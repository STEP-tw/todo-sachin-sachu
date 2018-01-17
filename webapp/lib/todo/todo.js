let TodoItem=require('./todoItem.js');
class Todo{
  constructor(title='',description='',list=[],key=0){
    this.key=key;
    this.itemKey=0;
    this.title=title;
    this.description=description;
    this.list={};
    list.forEach(item=>this.list[++this.itemKey]=new TodoItem(item,this.itemKey));
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
  get getTodoList(){
    return this.list;
  }
  set newTitle(_newTitle){
    this.title=_newTitle;
  }
  set newDescription(description){
    this.description=description;
  }
  getSpecificItem(key){
    return this.list[key];
  }
  removeSpecificItem(itemKey){
    if(!this.list[itemKey]) return false;
    delete this.list[itemKey];
    return true;
  }
  addItem(todoText){
    if(todoText!=''){
      this.list[++this.itemKey]=new TodoItem(todoText,this.itemKey);
      return true;
    }
    return false;
  }
  editItem(itemKey,newTodoItemText){
    if(newTodoItemText!='' && this.list[itemKey]){
      this.list[itemKey].todoText=newTodoItemText;
      return true;
    }
    return false;
  }
  markAsDone(itemKey){
    if(!this.list[itemKey]) return false;
    this.list[itemKey].setAsDone();
    return true;
  }
  markAsUndone(itemKey){
    if(!this.list[itemKey]) return false;
    this.list[itemKey].setAsUndone();
    return true;
  }
}
module.exports=Todo;
