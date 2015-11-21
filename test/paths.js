var expect = require('chai').expect;
var nock = require('nock');
var wrapi = require('../index');


describe("Paths", function() {
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
     ;

    this.client = new wrapi('http://api.a2zbooks.local/v1/', 
      {
        "simple": {
          "method": "GET",
          "path": "simple"
        },
        "fullPath": {
          "method": "GET",
          "path": "path/to/endpoint"
        },
        "relativePath": {
          "method": "GET",
          "path": "../v1/relative/path/to/endpoint"
        },
        "pathParam": {
          "method": "GET",
          "path": "path/:to/endpoint"
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

  });

});
