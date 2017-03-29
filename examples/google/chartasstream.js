'use strict';
/*eslint-disable no-console */

/*
 * node examples/google/chartasstream.js > qr.png
 */

var wrapi = require('../../index.js');
var endpoints = {
  qr: {
		method : 'GET',
    path: '',
    query: {
      cht: 'qr'
    }
  },
  ts: {
		method : 'GET',
    path: '',
    query: {
      cht: 'tx'
    }
  }
};

var chartsAPI = new wrapi('https://chart.googleapis.com/chart', endpoints);

// Listen for error
process.stdout.on('error', function(err) {
  console.error(err);
});

// Stream to stdout
chartsAPI.qr(
  {
    chs:'150x150',
    chl:'https://github.com/palanik/wrapi'
  },
  process.stdout
);
