var expect = require('chai').expect;
var nock = require('nock');
var wrapi = require('../index');


describe("Promise", function() {
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
      {
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
      },
      {json: true}
    );
  });

  afterEach(function() {
     nock.cleanAll();
  });

  describe("REST", function() {
    it("resolve", function(done) {
      var p = this.client.list();
      p.then(function (data) {
        expect(data).to.deep.equal([
          {id:1, name:"The Martian"},
          {id:2, name:"Odyssey"}
        ]);
        done();
      }, function(err) {
        expect(err).to.equal(null);
        done();
      });
    });

    it("reject", function(done) {
      var p = this.client.item(13);
      p.then(function (data) {
        expect(data).to.deep.equal([
          {id:1, name:"The Martian"},
          {id:2, name:"Odyssey"}
        ]);
        done();
      }, function(err) {
        expect(err).to.not.equal(null);
        done();
      })
    });

  });
});