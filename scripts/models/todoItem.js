class TodoItem{
  constructor(text,key,doneStatus=false){
    this.text=text;
    this.key=key;
    this.doneStatus=doneStatus;
  }
  set todoText(text){
    this.text=text;
  }
   setAsDone(){
    this.doneStatus=true;
  }
  setAsUndone(){
    this.doneStatus=false;
  }
}
module.exports=TodoItem;
