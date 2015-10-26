'use strict';

var endpoints = require('./github.api.json');
var wrapi = require('../../index.js');

var opts = {
  headers: {
    'User-Agent': 'wrapi-client'
  }
};

var client = new wrapi('https://api.github.com/', 
  endpoints, 
  opts
);

module.exports = client;
