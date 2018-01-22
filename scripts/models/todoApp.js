const User = require("./user.js");
const DataFormatter = require("./dataFormatter.js");
const fs = require('fs');

class TodoApp {
  constructor(dataBase) {
    this.DF = new DataFormatter(fs,dataBase,'utf8');
    this.allUsers = {};
  }
  isValidUser(userId,password){
    let user = this.allUsers[userId] || {};
    return password && user.password == password;
  }
  addSessionIdTo(userId,sessionId){
    let user = this.allUsers[userId];
    user && user.addSessionId(sessionId);
  }
  getUserBySessionId(sessionId){
    let userId=Object.keys(this.allUsers).find(key=>
      this.allUsers[key].isSameSessionID(sessionId)
    );
    return this.allUsers[userId];
  }
  loadData(){
    this.allUsers = this.DF.loadData;
  }
}

module.exports = TodoApp;
