const User = require('./user.js');

class DataFormatter {
  constructor(fs, fileName, encoding) {
    this.fs = fs;
    this.fileName = fileName;
    this.encoding = encoding;
    this.Users = {};
  }
  get getFileName() {
    return this.fileName;
  }
  get getEncoding() {
    return this.encoding;
  }
  get getUsers(){
    return this.Users;
  }
  readAsText() {
    try {
      return this.fs.readFileSync(this.fileName, this.encoding);
    } catch (e) {
      return undefined;
    }
  }
  readAsJSON() {
    try {
      return JSON.parse(this.fs.readFileSync(this.fileName, this.encoding));
    } catch (e) {
      return undefined;
    }
  }
  loadData() {
    try {
      let fileContent = this.readAsJSON();
      let userNames = Object.keys(fileContent);
      userNames.forEach(userName => {
        let user = fileContent[userName];
        let newUser = new User(user.name, user.userId, user.password);
        user.todos.forEach((ele) => {
          let todoKey = newUser.addNewTodo(ele.title, ele.description, []);
          let todoItemKeys = Object.keys(ele.items);
          todoItemKeys.forEach((itemKey) => {
            let item = ele.items[itemKey];
            newUser.addTodoItem(todoKey, item.text, item.doneStatus);
          });
        });
        this.Users[userName] = newUser;
      });
      return true;
    } catch (e) {
      this.User = new User();
      return false;
    }
  }
  write() {
    let newContents = JSON.stringify(this.User);
    this.fs.writeFileSync(this.fileName, newContents, this.encoding);
    return;
  }
}
module.exports = DataFormatter;
