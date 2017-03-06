var expect = require('chai').expect;
var nock = require('nock');
var wrapi = require('../index');
var fs = require('fs');
var semver = require('semver');

describe("Options Override", function() {
  before(function() {
    nock('http://api.a2zbooks.local/v1')
      .replyContentLength()
      .get('/cover-buffer')
      .replyWithFile(200, __dirname + '/data/blank.png', {'Content-Type': 'image/png'})
     ;
    nock('http://api.a2zbooks.local/v1')
      .replyContentLength()
      .get('/cover-string')
      .replyWithFile(200, __dirname + '/data/blank.png', {'Content-Type': 'image/png'})
     ;

    this.client = new wrapi('http://api.a2zbooks.local/v1/',
      {
        "coverString": {
          "method": "GET",
          "path": "cover-string"
        },
        "coverBuffer": {
          "method": "GET",
          "path": "cover-buffer",
          "options": {
            "encoding": null  // Returns body as buffer
          }
        }
      },
      {
        json: true,
        headers: {
          'User-Agent': 'wrapi-test'
        }
      }
    );
  });

  after(function() {
     nock.cleanAll();
  });

  it("string", function(done) {
    this.client.coverString(function(err, data, res) {
      expect(err).to.equal(null);
      expect(res.statusCode).to.equal(200);
      expect(Buffer.isBuffer(data)).to.be.false;
      done();
    });
  });

  if (semver.gte(process.versions.node, '0.11.13')) { // Buffer.equals
    it("buffer", function(done) {
      this.client.coverBuffer(function(err, data, res) {
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(200);
        expect(Buffer.isBuffer(data)).to.be.true;

        var image = fs.readFileSync(__dirname + '/data/blank.png');
        expect(image.equals(data)).to.be.true;

        done();
      });
    });
  }

});
