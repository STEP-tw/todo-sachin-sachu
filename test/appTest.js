let chai = require('chai');
let assert = chai.assert;
let request = require('./testHelpers/requestSimulator.js');
let app = require('../scripts/app.js');
let th = require('./testHelpers/testHelper.js');

describe('app',()=>{
  describe('GET /bad',()=>{
    it('responds with 404',done=>{
      request(app,{method:'GET',url:'/bad'},(res)=>{
        assert.equal(res.statusCode,404);
        done();
      })
    })
  })
  describe('GET /',()=>{
    it('gives index page',done=>{
      request(app,{method:'GET',url:'/'},(res)=>{
        th.status_is_ok(res);
        th.content_type_is(res,'text/html');
        done();
      })
    })
  })
  describe('GET /index.html',()=>{
    it('gives the index page',done=>{
      request(app,{method:'GET',url:'/index.html'},res=>{
        th.status_is_ok(res);
        th.content_type_is(res,'text/html');
        done();
      })
    })
  })

  describe.skip('POST /login',()=>{
    it('redirects to index.html with message for invalid user',done=>{
      request(app,{method:'POST',url:'/login',body:'userName=badUser'},res=>{
        th.should_be_redirected_to(res,'/index.html');
        done();
      })
    })
    it('redirects to index.html with message for invalid user',done=>{
      request(app,{method:'POST',url:'/login',body:'userName=a'},res=>{
        th.should_be_redirected_to(res,'/home');
        done();
      })
    })
  })

  describe.skip('POST /addTodo',()=>{
    it('redirects to index.html if user is not logged in',done=>{
      request(app,{method:'POST',url:'/addTodo'},res=>{
        th.should_be_redirected_to(res,'/index.html');
        done();
      })
    })
    it('redirects to /home if user is logged in',done=>{
      request(app,{method:'POST',url:'/addTodo',userName:'a'},res=>{
        th.should_be_redirected_to(res,'/home');
        done();
      })
    })
  })

})
