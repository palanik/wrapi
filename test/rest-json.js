var expect = require('chai').expect;
var nock = require('nock');
var wrapi = require('../index');

var baseURL = 'http://api.a2zbooks.local/v1/';
var endpoints = {
  "list" : {
    "method" : "GET",
    "path": "books"
  },
  "item": {
    "method" : "GET",
    "path": "books/:id"
  },
  "create": {
    "method" : "POST",
    "path": "books"
  },
  "update": {
    "method" : "PUT",
    "path": "books/:id"
  },
  "remove": {
    "method" : "DELETE",
    "path": "books/:id"
  }
};

describe("Restful JSON", function() {
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

    this.client = new wrapi(baseURL, 
      endpoints,
      {json: true}
    );
  });

  afterEach(function() {
     nock.cleanAll();
  });

  describe("REST", function() {
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


    it("create", function(done) {
      this.client.create({name: "The Metamorphosis"},function (err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal(
          {id:3}
        );
        expect(res.statusCode).to.equal(200);
        done();
      });
    });


    it("update", function(done) {
      this.client.update(3, {name: "The Time Machine"}, function (err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal(
          {id:3, name: "The Time Machine"}
        );
        expect(res.statusCode).to.equal(200);
        done();
      });
    });


    it("remove", function(done) {
      this.client.remove(3, function (err, data, res) {
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
        this.client.random(3,
          function (err, data, res) {}
        );
      }).to.throw ( TypeError );
      done();
    });

    it("toString()", function(done) {
      var str = this.client.toString();
      var src = JSON.parse(str);
      expect(src.baseURL).to.equal(baseURL);
      expect(src.endpoints).to.deep.equal(endpoints);
      done();
    });

  });
});