process.env.TESTFILE = "./test/testData/testData.json";
let chai = require('chai');
let assert = chai.assert;
let request = require('./testHelpers/requestSimulator.js');
let app = require('../scripts/app.js');
let th = require('./testHelpers/testHelper.js');

describe.skip('app', () => {
  describe('GET /', () => {
    it('gives index page', done => {
      request(app, {
        method: 'GET',
        url: '/'
      }, (res) => {
        th.status_is_ok(res);
        th.content_type_is(res, 'text/html');
        done();
      })
    })
  })
  describe('GET /index.html', () => {
    it('gives the index page', done => {
      request(app, {
        method: 'GET',
        url: '/index.html'
      }, res => {
        th.status_is_ok(res);
        th.content_type_is(res, 'text/html');
        done();
      })
    })
  })

  describe("redirectLoggedInUserToHome",()=>{
    it("should redirect to home when logged in user requests /",()=>{
      request(app,{method:'GET',url:"/",headers:{cookie:"sessionId=1001"}},res=>{
        th.should_be_redirected_to(res,'/home.html');
      })
    })
    it("should redirect to home when logged in user requests /index.html",()=>{
      request(app,{method:'GET',url:"/index.html",headers:{cookie:"sessionId=1001"}},res=>{
        th.should_be_redirected_to(res,'/home.html');
      })
    })
  })

  describe("GET /getNameOfUser",()=>{
    it("should give name of user",()=>{
      request(app,{method:"GET",url:"/getNameOfUser",headers:{cookie:"sessionId=1001"}},
    res=>{
      th.body_contains(res,"john");
      th.status_is_ok(res);
    })
    })
  })

  describe("POST /UPDATESTATUS/1",()=>{
    it("should update status of each item and return true",()=>{
      request(app,{method:"POST",url:"/UPDATESTATUS/1",headers:{cookie:"sessionId=1001"},
    body:"1=true&2=false"},
    res=>{
      th.body_contains(res,"true");
      th.status_is_ok(res);
    })
    })
  })

  describe("GET /getTodoTitles",()=>{
    it("should give todo titles of valid user",()=>{
      request(app,{method:"GET",url:"/getTodoTitles",headers:{cookie:"sessionId=1001"}},
    res=>{
      th.body_contains(res,'[{"title":"at Work","key":1}]');
      th.status_is_ok(res);
    })
    })
  })

  describe("POST /saveNewTodo", () => {
    it("should save new todo for valid user", () => {
      request(app, {
        method: 'POST',
        url: '/saveNewTodo',
        body: 'title=title_1&description=description_1&_ITEM_1=item_1&_ITEM_2=item_2',
        headers: {
          cookie: "sessionId=1001"
        }
      }, res => {
        th.should_be_redirected_to(res, "/home.html");
      });
    })
    it("should redirect to index for invalid user", () => {
      request(app, {
          method: 'POST',
          url: '/saveNewTodo',
          body: 'title=title_1&description=description_1&_ITEM_1=item_1&_ITEM_2=item_2'
        },
        res => {
          th.should_be_redirected_to(res, "/index.html");
        });
    })
  })

  describe("handleFileNotFound", () => {
    it("should give 404 for bad request for logged in user", () => {
      request(app, {
          url: "/bad",
          method: "GET",
          headers: {
            cookie: "sessionId=1001"
          }
        },
        res => {
          th.status_is_file_not_found(res);
        })
    })
  })

  describe("handleViewTodo",()=>{
    it("should give todo content for valid User and if Todo is present",()=>{
      request(app,{url:"/TODO/1",method:"GET",headers:{cookie:"sessionId=1001"}},
    res=>{
      th.status_is_ok(res);
      th.body_contains(res,"eat");
      th.body_contains(res,"sleep");
    })
    })
  })

  describe("DELETE /DELETE/",()=>{
    it("should delete todo valid user and valid todo key",()=>{
      request(app,{method:"DELETE",url:"/DELETE/1",headers:{cookie:'sessionId=1001'}},
      res=>{
        th.body_contains(res,"true");
      })
    })
    it("should give 404 for valid user and invalid todo key",()=>{
      let invalidKey = 10;
      request(app,{method:"DELETE",url:`/DELETE/${invalidKey}`,headers:{cookie:'sessionId=1001'}},
      res=>{
        th.status_is_file_not_found(res);
      })
    })
  })

  describe("GET /logout",()=>{
    it('should redirect to index page with expiring cookie for logged in user',()=>{
      request(app,{method:"GET",url:"/logout",headers:{cookie:"sessionId=1001"}},
    res=>{
      th.should_have_expiring_cookie_on(res,'sessionId','0',-1);
      })
    })
  })

  describe('POST /login', () => {
    it('redirects to home for valid user', done => {
      request(app, {
        method: 'POST',
        url: '/login',
        body: 'userId=john&password=john'
      }, res => {
        th.should_be_redirected_to(res, '/home.html');
        th.should_have_cookie_with_name(res, "sessionId");
        done();
      })
    })
    it('redirects to index for invalid user', done => {
      request(app, {
        method: 'POST',
        url: '/login',
        body: 'userId=badUser&password=badPassword'
      }, res => {
        th.should_be_redirected_to(res, '/index.html');
        th.should_have_expiring_cookie(res, "logInFailed", "true");
        done();
      })
    })
    it('redirects to index for empty request body', done => {
      request(app, {
        method: 'POST',
        url: '/login',
        body: ''
      }, res => {
        th.should_be_redirected_to(res, '/index.html');
        th.should_have_expiring_cookie(res, "logInFailed", "true");
        done();
      })
    })
    it('redirects to index for invalid username and empty password', done => {
      request(app, {
        method: 'POST',
        url: '/login',
        body: 'userId=badUser'
      }, res => {
        th.should_be_redirected_to(res, '/index.html');
        th.should_have_expiring_cookie(res, "logInFailed", "true");
        done();
      })
    })
    it('redirects to index for empty username and invalid password', done => {
      request(app, {
        method: 'POST',
        url: '/login',
        body: 'password=badPassword'
      }, res => {
        th.should_be_redirected_to(res, '/index.html');
        th.should_have_expiring_cookie(res, "logInFailed", "true");
        done();
      })
    })
  })



  describe('Any url without login', () => {
    it('should redirects to index', done => {
      request(app, {
        method: 'GET',
        url: '/badUrl'
      }, res => {
        th.should_be_redirected_to(res, '/index.html');
        th.should_not_have_cookie(res, 'sessionId');
        done();
      })
    })
  })
})
