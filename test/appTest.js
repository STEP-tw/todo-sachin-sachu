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

  describe('POST /login',()=>{
    it('redirects to home for valid user',done=>{
      request(app,{method:'POST',url:'/login',body:'userId=john&password=john'},res=>{
        th.should_be_redirected_to(res,'/home');
        th.should_have_cookie_with_name(res,"sessionid");
        done();
      })
    })
    it('redirects to index.html for invalid user',done=>{
      request(app,{method:'POST',url:'/login',body:'userId=badUser&password=badPassword'},res=>{
        th.should_be_redirected_to(res,'/index.html');
        th.should_have_expiring_cookie(res,"logInFailed","true");
        done();
      })
    })
    it('redirects to index.html for empty request body',done=>{
      request(app,{method:'POST',url:'/login',body:''},res=>{
        th.should_be_redirected_to(res,'/index.html');
        th.should_have_expiring_cookie(res,"logInFailed","true");
        done();
      })
    })
    it('redirects to index.html for invalid username and empty password',done=>{
      request(app,{method:'POST',url:'/login',body:'userId=badUser'},res=>{
        th.should_be_redirected_to(res,'/index.html');
        th.should_have_expiring_cookie(res,"logInFailed","true");
        done();
      })
    })
    it('redirects to index.html for empty username and invalid password',done=>{
      request(app,{method:'POST',url:'/login',body:'password=badPassword'},res=>{
        th.should_be_redirected_to(res,'/index.html');
        th.should_have_expiring_cookie(res,"logInFailed","true");
        done();
      })
    })
  })
})
