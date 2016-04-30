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
  },
  "byAuthor": {
    "method" : "GET",
    "path": "books/author",
    "query": {
      "type": "author"
    }
  }
};

describe("Restful register", function() {
  beforeEach(function() {
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
      
      .get('/books/author')
      .query({type:'author', q:'Homer'})
      .reply(200, [{id:2, name:"Odyssey", author:"Homer"}, {id:3, name:"Iliad", author:"Homer"}])
      ;

    this.client = new wrapi(baseURL, 
      {},
      {json: true}
    );

    var t = this.client.register("list", {
          "method" : "GET",
          "path": "books"
        });

    this.client.register("item", {
          "method" : "GET",
          "path": "books/:id"
        });

    this.client.register("create", {
          "method" : "POST",
          "path": "books"
        });

    this.client.register("update", {
          "method" : "PUT",
          "path": "books/:id"
        });

    this.client.register("remove", {
          "method" : "DELETE",
          "path": "books/:id"
        });

    this.client.register("remove", {
          "method" : "DELETE",
          "path": "books/:id"
        });

    this.client.register("remove", {
          "method" : "DELETE",
          "path": "books/:id"
        });

    this.client.register("byAuthor", {
          "method" : "GET",
          "path": "books/author",
          "query": {
            "type": "author"
          }
        });
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

    it("list by query", function(done) {
      this.client.byAuthor({q:'Homer'}, function (err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal([
          {id:2, name:"Odyssey", author:"Homer"},
          {id:3, name:"Iliad", author:"Homer"}
        ]);
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it("FAIL:random", function(done) {
      expect (function() {
        this.client.random(
          function (err, data, res) {}
        )
      }).to.throw ( TypeError );
      done();
    });

    it("register & call random", function(done) {
      this.client.register("random", {
        "method" : "GET",
        "path": "books/:id"
      }).item(1, function (err, data, res) {  // Also testing fluent interface
        expect(err).to.equal(null);
        expect(data).to.deep.equal(
          {id:1, name:"The Martian"}
        );
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it("Fail:register register", function(done) {
      var self = this;
      expect (function() {
        self.client.register("register", {
          "method" : "GET",
          "path": "books/register"
        });
      }).to.throw ( RangeError );
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