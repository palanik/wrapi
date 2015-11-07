var expect = require('chai').expect;
var nock = require('nock');
var wrapi = require('../index');


describe("Parameters", function() {
  beforeEach(function() {
    nock('http://api.a2zbooks.local/v1')
      
      .get('/books/byAuthor/Homer')
      .reply(200, [{id:2, name:"Odyssey", author:"Homer"}, {id:3, name:"Iliad", author:"Homer"}])
      
      .get('/books/byAuthor/Homer/Iliad')
      .reply(200, {id:3, name:"Iliad", author:"Homer"})

      ;

    this.client = new wrapi('http://api.a2zbooks.local/v1/', 
      {
        "byAuthor" : {
          "method" : "GET",
          "path": "books/byAuthor/:author"
        },
        "byAuthorTitle" : {
          "method" : "GET",
          "path": "books/byAuthor/:author/:title"
        }
      },
      {json: true}
    );
  });

  afterEach(function() {
  });

  describe("Params", function() {
    it("byAuthor", function(done) {
      this.client.byAuthor('Homer',function (err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal([
          {id:2, name:"Odyssey", author:"Homer"},
          {id:3, name:"Iliad", author:"Homer"}
        ]);
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it("byAuthorTitle", function(done) {
      this.client.byAuthorTitle('Homer', 'Iliad', function (err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal({
          id:3,
          name:"Iliad", author:"Homer"
        });
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it("byAuthorTitle - Extra Argument", function(done) {
      this.client.byAuthorTitle('Homer', 'Iliad', 'Greek', function (err, data, res) {
        expect(err).to.equal(null);
        expect(data).to.deep.equal({
          id:3,
          name:"Iliad", author:"Homer"
        });
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it("Fail:byAuthor - Missing argument", function(done) {
      this.client.byAuthor(function (err, data, res) {
        expect(err).to.not.equal(null);
        done();
      });
    });

    it("Fail:byAuthorTitle - Missing 1/2 arguments", function(done) {
      this.client.byAuthorTitle('Homer', function (err, data, res) {
        expect(err).to.not.equal(null);
        done();
      });
    });

    it("Fail:byAuthorTitle - Missing 2/2 arguments", function(done) {
      this.client.byAuthorTitle(function (err, data, res) {
        expect(err).to.not.equal(null);
        done();
      });
    });

    it("Fail:byAuthor - Invalid argument", function(done) {
      this.client.byAuthor('Weir', function (err, data, res) {
        expect(err).to.not.equal(null);
        expect(err.statusCode).to.equal(404);
        done();
      });
    });

    it("Fail:as query string", function(done) {
      this.client.byAuthor({author:'Homer'},function (err, data, res) {
        expect(err).to.not.equal(null);
        done();
      });
    });
  });
});