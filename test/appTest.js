process.env.TESTFILE = "./test/testData/testData.json";
let chai = require('chai');
let assert = chai.assert;
let request = require('supertest');
let app = require('../scripts/app.js');
let th = require('./testHelpers/testHelper.js');

describe('app', () => {
  describe('GET /', () => {
    it('gives index page', done => {
      request(app)
      .get('/')
      .expect(200)
      .expect('Content-type',/text\/html/)
      .end(done);
    })
  })
  describe('GET /index.html', () => {
    it('gives the index page', done => {
      request(app)
      .get('/index.html')
      .expect(200)
      .expect('Content-type',/text\/html/)
      .end(done);
    })
  })

  describe("redirectLoggedInUserToHome",()=>{
    it("should redirect to home when logged in user requests /",done=>{
      request(app)
        .get('/')
        .set("cookie","sessionId=1001")
        .expect(302)
        .expect("location","/home.html")
        .end(done);
    })
    it("should redirect to home when logged in user requests /index.html",done=>{
      request(app)
        .get('/index.html')
        .set("cookie","sessionId=1001")
        .expect(302)
        .expect("location","/home.html")
        .end(done);
    })
  })

  describe("GET /getNameOfUser",()=>{
    it("should give name of user",done=>{
      request(app)
        .get('/getNameOfUser')
        .set("cookie","sessionId=1001")
        .expect(200)
        .expect("john")
        .end(done);
    })
  })

  describe("POST /UPDATESTATUS/1",()=>{
    it("should update status of each item and return true",()=>{
      request(app)
        .post("/UPDATESTATUS/1")
        .set("cookie","sessionId=1001")
        .set("body","1=true&2=false")
        .expect(200)
        .expect("true")
    })
  })

  describe("GET /getTodoTitles",()=>{
    it("should give todo titles of valid user",done=>{
      request(app)
        .get("/getTodoTitles")
        .set("cookie","sessionId=1001")
        .expect(200)
        .expect(/title/)
        .expect(/at Work/)
        .end(done)
    })
  })

  describe("POST /saveNewTodo", () => {
    it("should save new todo for valid user", done => {
      request(app)
        .post("/saveNewTodo")
        .set("body","title=title_1&description=description_1&_ITEM_1=item_1&_ITEM_2=item_2")
        .set("cookie","sessionId=1001")
        .expect(302)
        .expect("location","/home.html")
        .end(done)
    })
    it("should redirect to index for invalid user", done => {
      let badSessionId = 2002;
      request(app)
        .post("/saveNewTodo")
        .set("body","title=title_1&description=description_1&_ITEM_1=item_1&_ITEM_2=item_2")
        .set("cookie",`sessionId=${badSessionId}`)
        .expect(302)
        .expect("location","/index.html")
        .end(done)
    })
  })

  describe("handleFileNotFound", () => {
    it("should give 404 for bad request for logged in user", done => {
      request(app)
        .get("/bad")
        .set("cookie",`sessionId=1001`)
        .expect(404)
        .end(done)
    })
  })

  describe.only("handleViewTodo",()=>{
    it("should give todo content for valid User and if Todo is present",done=>{
      request(app)
        .get('/TODO/1')
        .set('cookie','sessionId=1001')
        .expect(200)
        .expect(/eat/)
        .expect(/sleep/)
        .end(done)
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
