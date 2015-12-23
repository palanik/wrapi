var expect = require('chai').expect;
var nock = require('nock');
var wrapi = require('../index');

describe("Default Minimal", function() {
  before(function() {
    nock('http://api.a2zbooks.local/v1')
      .get('/books')
      .reply(200, [
        {id:1, name:"The Martian"},
        {id:2, name:"Odyssey"}
      ])
      
      .get('/books/1')
      .reply(200, {id:1, name:"The Martian"})
      
      .get('/books/2')
      .reply(200, {id:2, name:"Odyssey"})

      .post('/books', {
        name: "The Metamorphosis"
      })
      .reply(200, {id:3})
      
      .put('/books/3', {
        name: "The Time Machine"
      })
      .reply(200, {id:3, name: "The Time Machine"})
      
      .delete('/books/3')
      .reply(200, {id:3, name: "The Time Machine"})
      ;

    this.client = new wrapi('http://api.a2zbooks.local/v1/');
    var t = this.client.register("list", {
          "method" : "GET",
          "path": "books"
        });

    this.client.register("item", {
          "method" : "GET",
          "path": "books/:id"
        });

  });

  after(function() {
     nock.cleanAll();
  });

  describe("GETs", function() {
    it("list", function(done) {
      this.client.list(function (err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal([
          {id:1, name:"The Martian"},
          {id:2, name:"Odyssey"}
        ]);
        expect(res.statusCode).to.equal(200);
        done();
      });
    });


    it("item", function(done) {
      this.client.item(2, function (err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal(
          {id:2, name:"Odyssey"}
        );
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
    
  });
});