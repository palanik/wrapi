var expect = require('chai').expect;
var nock = require('nock');
var wrapi = require('../index');
var fs = require('fs');


describe("optsOverride", function() {
  before(function() {
    nock('http://api.a2zbooks.local/v1')
      .replyContentLength()
      .get('/cover')
      .replyWithFile(200, __dirname + '/data/blank.png', {'Content-Type': 'image/png'})
     ;

    this.client = new wrapi('http://api.a2zbooks.local/v1/',
      {
        "cover": {
          "method": "GET",
          "path": "cover",
          "options": {
            "encoding": null  // return data as buffer
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

  it("buffer", function(done) {
    this.client.cover(function(err, data, res) {
      expect(err).to.equal(null);
      expect(res.statusCode).to.equal(200);
      expect(Buffer.isBuffer(data)).to.be.true;

      var image = fs.readFileSync(__dirname + '/data/blank.png');
      expect(image.equals(data)).to.be.true;
      
      done();
    });
  });


});
