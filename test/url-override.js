var expect = require('chai').expect;
var nock = require('nock');
var wrapi = require('../index');


describe("urlOverride", function() {
  before(function() {
    nock('http://api.a2zbooks.local/v1')

      .get('/simple')
      .reply(200, "Simple")

      .get('/path/to/endpoint')
      .reply(200, "path/to/endpoint")

      .get('/relative/path/to/endpoint')
      .reply(200, "relative/path/to/endpoint")

      .get('/path/2/endpoint')
      .reply(200, "path/2/endpoint")

      .get('/path/3/endpoint')
      .query({q:'hello'})
      .reply(200, "path/3/endpoint")

      .get('/path/4/endpoint')
      .query({q:'bye'})
      .reply(200, "path/4/endpoint")
     ;

    this.client = new wrapi('http://wrong.base.url/v1/', 
      {
        "simple": {
          "method": "GET",
          "url": "http://api.a2zbooks.local/v1/simple"
        },
        "fullPath": {
          "method": "GET",
          "url": "http://api.a2zbooks.local/v1/path/to/endpoint"
        },
        "relativePath": {
          "method": "GET",
          "url": "http://api.a2zbooks.local/v1/../v1/relative/path/to/endpoint"
        },
        "pathParam": {
          "method": "GET",
          "url": "http://api.a2zbooks.local/v1/path/:to/endpoint"
        },
        "pathParamAndQuery": {
          "method": "GET",
          "url": "http://api.a2zbooks.local/v1/path/:three/endpoint"
        },
        "pathParamPlusQuery": {
          "method": "GET",
          "url": "http://api.a2zbooks.local/v1/path/:four/endpoint",
          "query": {
            "q": "bye"
          }
        }
      },
      {
        headers: {
          'User-Agent': 'wrapi-test'
        }
      }
    );
  });

  after(function() {
     nock.cleanAll();
  });

  describe("All Paths", function() {
    it("simple", function(done) {
      this.client.simple(function(err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.equal("Simple");
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it("full path", function(done) {
      this.client.fullPath(function(err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.equal("path/to/endpoint");
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it("relative path", function(done) {
      this.client.relativePath(function(err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.equal("relative/path/to/endpoint");
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it("path with param", function(done) {
      this.client.pathParam(2, function(err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.equal("path/2/endpoint");
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it("path with param & query", function(done) {
      this.client.pathParamAndQuery(3, {q:'hello'}, function(err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.equal("path/3/endpoint");
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it("path with param plus query", function(done) {
      this.client.pathParamPlusQuery(4, function(err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.equal("path/4/endpoint");
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

  });

});
