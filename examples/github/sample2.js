'use strict';
/*eslint-disable no-console */

var wrapi = require('../../index.js');
var githubAPI = new wrapi('https://api.github.com/');
githubAPI.register('zen', 
  {
    method : 'GET',
    path: 'zen'
  }
);

githubAPI.zen(function(err, response) {
  if (!err) {
    console.log('Chris says "' + response + '"');
  }
});
