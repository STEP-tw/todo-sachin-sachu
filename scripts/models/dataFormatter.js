const Todos=require('./todos.js');

class DataFormatter{
  constructor(fs,fileName,encoding){
    this.fs=fs;
    this.fileName=fileName;
    this.encoding=encoding;
    this.Todos=undefined;
  }
  get getFileName(){
    return this.fileName;
  }
  get getEncoding(){
    return this.encoding;
  }
  readAsText(){
    try{
      return this.fs.readFileSync(this.fileName,this.encoding);
    }catch(e){
      return undefined;
    }
  }
  readAsJSON(){
    try{
      return JSON.parse(this.fs.readFileSync(this.fileName,this.encoding));
    }catch(e){
      return undefined;
    }
  }
  makeTodoObject(){
    try{
      let fileContent=this.readAsJSON();
      this.Todos=new Todos(fileContent.todoKey);
      let todoKeys=Object.keys(fileContent.todos);
      let todosObj=fileContent.todos;
      todoKeys.forEach((key)=>{
        let todoKey=this.Todos.addNewTodo(todosObj[key].title,todosObj[key].description,[]);
        let todoItemKeys=Object.keys(todosObj[key].items);
        todoItemKeys.forEach((itemKey)=>{
          this.Todos.addTodoItem(todoKey,todosObj[key].items[itemKey].text,todosObj[key].items[itemKey].doneStatus);
        });
      });
      return true;
    }catch(e){
      this.Todos=new Todos();
      return false;
    }
  }
  write(){
    let newContents=JSON.stringify(this.Todos);
    this.fs.writeFileSync(this.fileName,newContents,this.encoding);
    return;
  }
}
module.exports=DataFormatter;
