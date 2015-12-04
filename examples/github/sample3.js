'use strict';
/*eslint-disable no-console */

// Sample1 as Promise

var githubAPI = require('./github.api.js');

var zen = githubAPI.zen();
zen.then(function(data) {
  console.log("Today's wizdom words: \"" + data +"\"");
  console.log();
});

// Print Highest Contributor to node repo.
var contributors = githubAPI.contributors('nodejs', 'node');
contributors.then(function(response) {
  // This is redundant as it's already sorted.
  var highest = response.reduce(function (acc, v) {
    if (v.contributions > acc.contributions) {
      acc.login = v.login;
      acc.contributions = v.contributions;
    }
    return acc;
  },
  {contributions: -1}
  );

  return highest;
}, function(err) {
  console.error("Error getting contributors: %j", err);
})
.then(function(highest) {
  var user = githubAPI.user(highest.login);
  user.then(function(response) {
    var name = response.name ? response.name : response.login;
    console.log('Highest contributions to \'nodejs/node\' made by user \'' + name + '\'.');
    console.log(name + ' made ' + highest.contributions + ' contributions.');
  });
});

