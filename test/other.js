var expect = require('chai').expect;
var nock = require('nock');
var wrapi = require('../index');


describe("Misc. test cases", function() {
  beforeEach(function() {
    nock('http://api.a2zbooks.local/v1')

      .get('/hello')
      .query({echo: false})
      .reply(200, "Hi there!")

      .get('/bye')
      .query({echo: false})
      .reply(200, JSON.stringify({"response":"Good Bye!"}))

      .get('/echo')
      .query({echo: false})
      .reply(200, "Echo ...")

      .get('/echo')
      .query({echo: true})
      .reply(200, "Who are you?")
      ;

    this.client = new wrapi('http://api.a2zbooks.local/v1/', 
      {
        "hello": {
          "method": "GET",
          "path": "hello"
        },
        "bye": {
          "method": "GET",
          "path": "bye"
        },
        "echo": {
          "method": "GET",
          "path": "echo"
        }
      },
      {
        headers: {
          'User-Agent': 'wrapi-test'
        },
        qs: {
          echo: false
        }
      }
    );
  });

  afterEach(function() {
     nock.cleanAll();
  });

  describe("Response types", function() {
    it("text response", function(done) {
      this.client.hello(function(err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.equal("Hi there!");
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it("json response as text", function(done) {
      this.client.bye(function(err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal({response:"Good Bye!"});
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

  });

  describe("Query String Override", function() {
    it("query string default", function(done) {
      this.client.echo(function(err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.equal("Echo ...");
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it("query string override", function(done) {
      this.client.echo({echo:true}, function(err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.equal("Who are you?");
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

  });
});
