var expect = require('chai').expect;
var nock = require('nock');
var wrapi = require('../index');


describe("Nested register", function() {
  beforeEach(function() {
    nock('http://api.a2zbooks.local/v1')
      .get('/books')
      .reply(200, [
        {id:1, name:"The Martian"},
        {id:2, name:"Odyssey"}
      ])
      
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

    this.client = new wrapi('http://api.a2zbooks.local/v1/', 
      {},
      {json: true}
    );

    this.client.register("books.list", {
      "method" : "GET",
      "path": "books"
    });

    this.client.register("books.item", {
      "method" : "GET",
      "path": "books/:id"
    });
    
    this.client.register("books.item.create", {
      "method" : "POST",
      "path": "books"
    });
    
    this.client.register("books.item.update", {
      "method" : "PUT",
      "path": "books/:id"
    });
    
    this.client.register("books.item.remove", {
      "method" : "DELETE",
      "path": "books/:id"
    });

  });

  afterEach(function() {
     nock.cleanAll();
  });

  describe("REST", function() {
    it("list", function(done) {
      this.client.books.list(function (err, data, res) {
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
      this.client.books.item(2, function (err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal(
          {id:2, name:"Odyssey"}
        );
        expect(res.statusCode).to.equal(200);
        done();
      });
    });


    it("create", function(done) {
      this.client.books.item.create({name: "The Metamorphosis"},function (err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal(
          {id:3}
        );
        expect(res.statusCode).to.equal(200);
        done();
      });
    });


    it("update", function(done) {
      this.client.books.item.update(3, {name: "The Time Machine"}, function (err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal(
          {id:3, name: "The Time Machine"}
        );
        expect(res.statusCode).to.equal(200);
        done();
      });
    });


    it("remove", function(done) {
      this.client.books.item.remove(3, function (err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal(
          {id:3, name: "The Time Machine"}
        );
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it("random", function(done) {
      expect (function() {
        this.client.books.item.random(3,
          function (err, data, res) {}
        );
      }).to.throw ( TypeError );
      done();
    });

  });
});