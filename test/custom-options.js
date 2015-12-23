var expect = require('chai').expect;
var nock = require('nock');
var wrapi = require('../index');

describe("Default options", function() {
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
      .reply(404, {id:2, message:"Not found"})

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


    it("valid item", function(done) {
      this.client.item(1, function (err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal(
          {id:1, name:"The Martian"}
        );
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it("invalid item", function(done) {
      this.client.item(2, function (err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal(
          {id:2, message:"Not found"}
        );
        expect(res.statusCode).to.equal(404);
        done();
      });
    });
    
  });
});


describe("Custom catchHTTP4xx5xx", function() {
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
      .reply(404, {id:2, message:"Not found"})

      ;

    this.client = new wrapi('http://api.a2zbooks.local/v1/',
      {},
      {
        catchHTTP4xx5xx: true
      });
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


    it("valid item", function(done) {
      this.client.item(1, function (err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal(
          {id:1, name:"The Martian"}
        );
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it("invalid item", function(done) {
      this.client.item(2, function (err, data, res) {
        expect(err).to.deep.equal(
          {id:2, message:"Not found"}
        );
        expect(res.statusCode).to.equal(404);
        done();
      });
    });
    
  });
});