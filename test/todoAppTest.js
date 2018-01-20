const chai=require('chai');
const assert=chai.assert;

const User=require('../scripts/models/user.js');
const TodoApp=require('../scripts/models/todoApp.js');

describe('TodoApp',()=>{
  beforeEach(()=>{
    App=new TodoApp();
  })

  describe('# isValidUser()',()=>{
    it("should return true for valid user",()=>{
      assert.isOk(App.isValidUser("john","john"));
    })
    it("should return false for invalid user",()=>{
      assert.isNotOk(App.isValidUser("badUser","badPassword"));
    })
  })

  describe('# addSessionIdTo',()=>{
    it("should add sessionid to the valid user",()=>{
      App.addSessionIdTo('john',1001);
      assert.equal(App.allUsers['john'].sessionId,1001);
    })
    it("should not add sessionid to the invalid user",()=>{
      App.addSessionIdTo('badUser',1001);
      assert.isUndefined(App.allUsers['badUser']);
    })
  })

  describe('# getUserBySessionId()',()=>{
    it('should return specific user for valid sessionId',()=>{
      App.addSessionIdTo('john',1001);
      let expectedUser=new User('john','john','john');
      expectedUser.addSessionId(1001);
      assert.deepEqual(App.getUserBySessionId(1001),expectedUser);
    })
    it('should return undefined for invalid sessionId',()=>{
      assert.isUndefined(App.getUserBySessionId(1001));
    })
  })
})
