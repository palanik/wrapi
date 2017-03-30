'use strict';
/*eslint-disable no-console */

/*
 * node examples/google/charts.js > qr.png
 */

var wrapi = require('../../index.js');
var endpoints = {
  qr: {
		method : 'GET',
    path: '',
    query: {
      cht: 'qr'
    },
    options: {
      encoding: null
    }
  },
  ts: {
		method : 'GET',
    path: '',
    query: {
      cht: 'tx'
    },
    options: {
      encoding: null
    }
  }
};

var chartsAPI = new wrapi('https://chart.googleapis.com/chart', endpoints);
chartsAPI.qr(
  {
    chs:'150x150',
    chl:'https://github.com/palanik/wrapi'
  },
  function(err, data) {
    if (err) {
      console.error(err);
      return;
    }
    process.stdout.write(data);
  }
);
