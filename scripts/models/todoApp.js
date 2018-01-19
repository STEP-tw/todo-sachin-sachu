const User = require("./user.js");

class TodoApp {
  constructor() {
    this.allUsers = {'john':new User('john','john','john')};
  }
  isValidUser(userId,password){
    let user = this.allUsers[userId] || {};
    return password && user.password == password;
  }
  addSessionIdTo(userId,sessionid){
    let user = this.allUsers[userId];
    user && user.addSessionId(sessionid);
  }
  getUserBySessionId(sessionid){
    debugger;
    let userId=Object.keys(this.allUsers).find(key=>
      this.allUsers[key].isSameSessionID(sessionid)
    );
    return this.allUsers[userId];
  }
}

module.exports = TodoApp;
