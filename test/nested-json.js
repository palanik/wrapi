var expect = require('chai').expect;
var nock = require('nock');
var wrapi = require('../index');


describe("Nested JSON", function() {
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

      .get('/movies')
      .reply(200, [
        {id:101, name:"Tenet"},
        {id:102, name:"No Time To Die"}
      ])

      .get('/movies/101')
      .reply(200, {id:101, name:"Tenet"})

      .post('/movies', {
        name: "Coming 2 America"
      })
      .reply(200, {id:103})
      ;

    this.client = new wrapi('http://api.a2zbooks.local/v1/', 
      {
        "books.list" : {
          "method" : "GET",
          "path": "books"
        },
        "books.item": {
          "method" : "GET",
          "path": "books/:id"
        },
        "books.item.create": {
          "method" : "POST",
          "path": "books"
        },
        "books.item.update": {
          "method" : "PUT",
          "path": "books/:id"
        },
        "books.item.remove": {
          "method" : "DELETE",
          "path": "books/:id"
        },
        // reverse order
        "movies.item.create": {
          "method" : "POST",
          "path": "movies"
        },
        "movies.item": {
          "method" : "GET",
          "path": "movies/:id"
        },
        "movies" : {
          "method" : "GET",
          "path": "movies"
        }
      },
      {json: true}
    );
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

    // reverse order endpoints
    it("list - movies", function(done) {
      this.client.movies(function (err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal([
          {id:101, name:"Tenet"},
          {id:102, name:"No Time To Die"}
        ]);
        expect(res.statusCode).to.equal(200);
        done();
      });
    });


    it("item - movies", function(done) {
      this.client.movies.item(101, function (err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal(
          {id:101, name:"Tenet"}
        );
        expect(res.statusCode).to.equal(200);
        done();
      });
    });


    it("create - movies", function(done) {
      this.client.movies.item.create({name: "Coming 2 America"},function (err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal(
          {id:103}
        );
        expect(res.statusCode).to.equal(200);
        done();
      });
    });


  });
});