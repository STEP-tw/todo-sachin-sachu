let chai = require('chai');
let assert = chai.assert;
let request = require('./testFramwWork/requestSimulator.js');
process.env.COMMENT_STORE = "./testStore.json";
let app = require('./testFramwWork/app.js');
let th = require('./testFramwWork/testHelper.js');

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

  // describe('POST /login',()=>{
  //   it('redirects to guestBook for valid user',done=>{
  //     request(app,{method:'POST',url:'/login',body:'username=arvind'},res=>{
  //       th.should_be_redirected_to(res,'/guestBook');
  //       th.should_not_have_cookie(res,'message');
  //       done();
  //     })
  //   })
  //   it('redirects to login.html with message for invalid user',done=>{
  //     request(app,{method:'POST',url:'/login',body:'username=badUser'},res=>{
  //       th.should_be_redirected_to(res,'/login.html');
  //       th.should_have_expiring_cookie(res,'message','login failed');
  //       done();
  //     })
  //   })
  // })

  describe.skip('POST /submitForm',()=>{
    it('serves the javascript source',done=>{
      request(app,{method:'POST',url:'/submitForm',body:'name=Foo&comment=Faa'},res=>{
        th.should_be_redirected_to(res,'/guestBook');
        done();
      })
    })
  })
})
