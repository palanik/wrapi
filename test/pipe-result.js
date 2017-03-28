var expect = require('chai').expect;
var nock = require('nock');
var wrapi = require('../index');
var fs = require('fs');
var semver = require('semver');

var Writable = require('stream').Writable;
var util = require('util');

function WritableStream(options) {
  if (!(this instanceof WritableStream)) {
    return new WritableStream(options);
  }
  Writable.call(this, options);
  this.buffer = new Buffer(0);;
}
util.inherits(WritableStream, Writable);

WritableStream.prototype._write = function(chunk, encoding, callback) {
  this.buffer = Buffer.concat([this.buffer, chunk]);
  callback();
}

describe("Pipe Results", function() {
  before(function() {
    var scope = nock('http://api.a2zbooks.local/v1')
      .get('/content')
      .reply(200, fs.createReadStream(__dirname + '/data/dummy.txt'))

      .post('/content', {page: 1})
      .reply(200, fs.createReadStream(__dirname + '/data/dummy.txt'))

      .get('/cover')
      .reply(200, fs.createReadStream(__dirname + '/data/blank.png'))

      .post('/cover', {back:true})
      .reply(200, fs.createReadStream(__dirname + '/data/blank.png'))

      .get('/error/23')
      .reply(200, fs.createReadStream(__dirname + '/data/blank.png'))
      ;


    this.client = new wrapi('http://api.a2zbooks.local/v1/',
      {
        "content" : {
          "method" : "GET",
          "path": "content"
        },
        "content.page" : {
          "method" : "POST",
          "path": "content"
        },
        "cover" : {
          "method" : "GET",
          "path": "cover"
        },
        "cover.front" : {
          "method" : "POST",
          "path": "cover"
        },
        "error" : {
          "method" : "GET",
          "path": "error/:id"
        },
        "excpt" : {
          "method" : "GET",
          "path": "excpt/:id"
        }
      },
      {json: true}
    );
  });

  after(function() {
     nock.cleanAll();
  });

  describe("Text Stream", function() {
    it("GET", function(done) {
      var data = fs.readFileSync(__dirname + '/data/dummy.txt', 'utf8');
      var resp = new WritableStream();
      var ret = this.client.content(resp);
      resp.on('finish', function() {
        var str = resp.buffer.toString();
        expect(resp.buffer.toString()).to.equal(data);
        done();
      });
    });

    it("POST", function(done) {
      var data = fs.readFileSync(__dirname + '/data/dummy.txt', 'utf8');
      var resp = new WritableStream();
      var ret = this.client.content.page({page: 1}, resp);
      resp.on('finish', function() {
        var str = resp.buffer.toString();
        expect(resp.buffer.toString()).to.equal(data);
        done();
      });
    });

  });

  describe("Binary Stream", function() {
    it("GET", function(done) {
      var data = fs.readFileSync(__dirname + '/data/blank.png');
      var resp = new WritableStream();
      var ret = this.client.cover(resp);
      resp.on('finish', function() {
        if (semver.gte(process.versions.node, '0.11.13')) {
          expect(resp.buffer.equals(data)).to.be.true;
        }
        else {
          expect(resp.buffer.length).to.equal(data.length);
        }
        done();
      });
    });

    it("POST", function(done) {
      var data = fs.readFileSync(__dirname + '/data/blank.png');
      var resp = new WritableStream();
      var ret = this.client.cover.front({back: true}, resp);
      resp.on('finish', function() {
        if (semver.gte(process.versions.node, '0.11.13')) {
          expect(resp.buffer.equals(data)).to.be.true;
        }
        else {
          expect(resp.buffer.length).to.equal(data.length);
        }
        done();
      });
    });

  });

  describe("Exception while piping", function() {
    it("Missing param", function(done) {
      var resp = new WritableStream();
      expect(this.client.error.bind(this.client, resp)).to.throw('Failed to substitute :id in pattern error/:id');
      done();
    });

    it("Stream exception", function(done) {
      var resp = new WritableStream();
      resp.on('error', function(err) {
        done();
      });
      this.client.excpt(23, resp);
    });
  });

});
