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
  get loadData(){
    this.loadDataFromFile();
    return this.Users;
  }
  readAsJSON() {
    try {
      return JSON.parse(this.fs.readFileSync(this.fileName, this.encoding));
    } catch (e) {
      return undefined;
    }
  }
  loadDataFromFile() {
    try {
      let fileContent = this.readAsJSON();
      let userNames = Object.keys(fileContent);
      userNames.forEach(userName => {
        let user = fileContent[userName];
        let newUser = new User(user.name, user.userId, user.password);
        user.sessionId && newUser.addSessionId(user.sessionId);
        newUser.loadData(user.todos);
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
