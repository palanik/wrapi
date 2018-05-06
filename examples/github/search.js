'use strict';
/*eslint-disable no-console */

var wrapi = require('../../index.js');
var githubAPI = new wrapi('https://api.github.com/');
githubAPI.register('search',
  {
    method : 'GET',
    path: 'search/commits',
    options: {
      headers: {
        'Accept': 'application/vnd.github.cloak-preview'
      }
    }
  }
);

githubAPI.search({q:'committer-date:>2018-01-01 "go eagles"' },function(err, response) {
  if (!err) {
    console.log(JSON.stringify(response, null, 2));
  }
});
