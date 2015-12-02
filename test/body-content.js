var expect = require('chai').expect;
var nock = require('nock');
var wrapi = require('../index');


describe("Body Content", function() {
  before(function() {
    var scope = nock('http://api.a2zbooks.local/v1')
      .matchHeader('Content-Type', /multipart\/form-data;.*/)
      .post('/booksForm')
      .reply(200, [{id:2, name:"Odyssey", author:"Homer"}, {id:3, name:"Iliad", author:"Homer"}])
      ;

    this.client = new wrapi('http://api.a2zbooks.local/v1/', 
      {
        "booksForm" : {
          "method" : "POST",
          "path": "booksForm"
        }
      },
      {json: true}
    );
  });

  after(function() {
     nock.cleanAll();
  });

  describe("multipart", function() {
    it("multipart/form-data", function(done) {
      this.client.booksForm({formData: {author:'Homer',title:'Iliad'}}, function (err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal([
          {id:2, name:"Odyssey", author:"Homer"},
          {id:3, name:"Iliad", author:"Homer"}
        ]);
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
  });

});


describe("JSON Content", function() {
  before(function() {
    var scope = nock('http://api.a2zbooks.local/v1')
      .matchHeader('Content-Type', /application\/json.*/)
      .post('/booksJson', {author:'Homer',title:'Iliad'})
      .reply(200, {id:3, name:"Iliad", author:"Homer"})
      ;

    this.client = new wrapi('http://api.a2zbooks.local/v1/', 
      {
        "booksJson" : {
          "method" : "POST",
          "path": "booksJson"
        }
      },
      {json: true}
    );
  });

  after(function() {
     nock.cleanAll();
  });

  describe("json", function() {
    it("json", function(done) {
      this.client.booksJson({author:'Homer',title:'Iliad'}, function (err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal({id:3, name:"Iliad", author:"Homer"});
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

  });

});


