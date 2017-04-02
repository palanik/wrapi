'use strict';
/*eslint-disable no-console */

/*
 * node examples/google/charts.js > qr.png
 */

var wrapi = require('../../index.js');
var endpoints = {
  latest: {
		method : 'GET',
    path: 'latest'
  },
  historical: {
		method : 'GET',
    path: ':date'
  },
  "latest.USD": {
		method : 'GET',
    path: 'latest',
    query: {
      base: 'USD'
    }
  },
  "historical.USD": {
		method : 'GET',
    path: ':date',
    query: {
      base: 'USD'
    }
  }
};

var fixer = new wrapi('https://api.fixer.io/', endpoints, { json:true });
fixer.latest.USD(function(err, data) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(data);
  }
);

fixer.latest({symbols:'USD,GBP'}, function(err, data) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(data);
  }
);
