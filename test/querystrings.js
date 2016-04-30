var expect = require('chai').expect;
var nock = require('nock');
var wrapi = require('../index');


describe("Query Strings", function() {
  before(function() {
    nock('http://api.a2zbooks.local/v1')
      
      .get('/books')
      .query({author:'Homer'})
      .reply(200, [{id:2, name:"Odyssey", author:"Homer"}, {id:3, name:"Iliad", author:"Homer"}])
      
      .get('/books')
      .query({author:'Homer',title:'Iliad'})
      .reply(200, {id:3, name:"Iliad", author:"Homer"})

      ;

    this.client = new wrapi('http://api.a2zbooks.local/v1/', 
      {
        "books" : {
          "method" : "GET",
          "path": "books"
        }
      },
      {json: true}
    );
  });

  after(function() {
     nock.cleanAll();
  });

  describe("Author/Title", function() {
    it("byAuthorTitle", function(done) {
      this.client.books({author:'Homer',title:'Iliad'}, function (err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal({
          id:3,
          name:"Iliad", 
          author:"Homer"
        });
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it("byAuthor", function(done) {
      this.client.books({author:'Homer'},function (err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal([
          {id:2, name:"Odyssey", author:"Homer"},
          {id:3, name:"Iliad", author:"Homer"}
        ]);
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it("Fail:Missing query string", function(done) {
      this.client.books(function (err, data, res) {
        expect(err).to.not.equal(null);
        done();
      });
    });

    it("Fail:as params", function(done) {
      this.client.books('Homer', function (err, data, res) {
        expect(err).to.not.equal(null);
        done();
      });
    });

    it("Fail:byAuthor - Invalid argument", function(done) {
      this.client.books({author:'Weir'}, function (err, data, res) {
        expect(err).to.not.equal(null);
        expect(err.statusCode).to.equal(404);
        done();
      });
    });

  });
});


describe("Query Strings Override", function() {
  before(function() {
    nock('http://api.a2zbooks.local/v1')
            
      .get('/books')
      .query({author:'Homer',title:'Iliad'})
      .reply(200, {id:3, name:"Iliad", author:"Homer"})

      .get('/books')
      .query({author:'Homer',title:'Odyssey'})
      .reply(200, {id:2, name:"Odyssey", author:"Homer"})
      ;

    this.client = new wrapi('http://api.a2zbooks.local/v1/', 
      {
        "books" : {
          "method" : "GET",
          "path": "books"
        }
      },
      {
        json: true,
        qs: {
          title: "Odyssey"
        }
      }
    );
  });

  after(function() {
     nock.cleanAll();
  });

  describe("Author/Title", function() {
    it("byAuthorTitle", function(done) {
      this.client.books({author:'Homer',title:'Iliad'}, function (err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal({
          id:3,
          name:"Iliad", 
          author:"Homer"
        });
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it("byAuthor - return default book", function(done) {
      this.client.books({author:'Homer'},function (err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal({
          id:2,
          name:"Odyssey", 
          author:"Homer"
        });
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

  });
});

describe("Single Endpoint - Resources vary by Query Strings", function() {
  before(function() {
    nock('http://api.a2zbooks.local/v1')

      .get('/books')
      .query({type:'author', q:'Homer'})
      .reply(200, [{id:2, name:"Odyssey", author:"Homer"}, {id:3, name:"Iliad", author:"Homer"}])

      .get('/books')
      .query({type:'genre', q:'sci-fi'})
      .reply(200, [{id:4, name:"The Time Machine", author:"H. G. Wells"}])

      .get('/books')
      .query({type:'medium', q:'kindle'})
      .reply(200, [{id:2, name:"Odyssey", author:"Homer"}, {id:4, name:"The Time Machine", author:"H. G. Wells"}])
      ;

    this.client = new wrapi('http://api.a2zbooks.local/v1/',
      {
        "books.author" : {
          "method" : "GET",
          "path": "books",
          "query": {
            "type": "author"
          }
        },
        "books.genre" : {
          "method" : "GET",
          "path": "books",
          "query": {
            "type": "genre"
          }
        },
        "books.medium" : {
          "method" : "GET",
          "path": "books",
          "query": {
            "type": "medium"
          }
        }
      },
      {
        json: true
      }
    );
  });

  after(function() {
     nock.cleanAll();
  });

  describe("Books/Type", function() {
    it("type:author", function(done) {
      this.client.books.author({q:'Homer'}, function (err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal([
          {id:2, name:"Odyssey", author:"Homer"},
          {id:3, name:"Iliad", author:"Homer"}
        ]);
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it("type:genre", function(done) {
      this.client.books.genre({q:'sci-fi'},function (err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal([
          {id:4, name:"The Time Machine", author:"H. G. Wells"}
        ]);
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it("type:author Overridden to type:medium", function(done) {
      this.client.books.author({type:'medium', q:'kindle'},function (err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal([
          {id:2, name:"Odyssey", author:"Homer"}, 
          {id:4, name:"The Time Machine", author:"H. G. Wells"}
        ]);
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
  });
});