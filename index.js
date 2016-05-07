'use strict';

var request = require('request');
var pattern = require('urlpattern').express;
var extend = require('extend');
var url = require('url');
var nest = require('./utils').nest;

function wrapi(baseURL, endpoints, opts) {
  var defaultOpts = {
    catchHTTP4xx5xx:false
  };

  opts = opts || defaultOpts;

  if (!opts.qs) {
    opts.qs = {};
  }

  endpoints = endpoints || {};

  this.toString = function() {
    return JSON.stringify({
      'baseURL': baseURL,
      'endpoints': endpoints,
      'opts': opts
    });
  };

  this.register = function(e, endPoint) {
    endpoints[e] = endPoint;
    return defineEndpoint(e, endPoint);
  };
  
  var self = this;

  function api(method, apiUrl, qs, callback, content) {
    // request function for "DELETE" is .del - https://github.com/request/request#requestdel
    method = (method == 'DELETE') ? 'DEL' : method;

    var apiOpts = extend(true, {}, opts);
    apiOpts.qs = extend(apiOpts.qs, qs);
    if (content) {
      apiOpts.body = content;
      if (typeof content == 'object' && Object.keys(content).length == 1) {
        if (Object.keys(content)[0] == 'formData') {
          apiOpts.formData = content['formData']; // https://github.com/request/request#forms
          delete apiOpts.body;
          apiOpts.json = false;
        }
      }
    }

    if (!apiOpts.headers) {
      apiOpts.headers = {};
    }
    if (!apiOpts.headers['User-Agent']) {
      apiOpts.headers['User-Agent'] = 'wrapi-client';
    }

    request[method.toLowerCase()](apiUrl,
            apiOpts,
            function(e, r, body) {
              if (e) {
                callback(e);
              }
              else {
                // 'PATCH', 'POST', 'PUT' return json as body
                if (typeof body == 'string') {
                  try {
                    var json = JSON.parse(body);
                    body = json;
                  }
                  catch(e) {
                    // Not json
                  }
                }

                if (apiOpts.catchHTTP4xx5xx && r.statusCode >= 400 && r.statusCode <= 599) {
                  callback(body, null, r);
                }
                else {
                  callback(null, body, r);  
                }
                
              }
            }
          );
  }

  // 
  function defineEndpoint(e, endPoint) {
    e = e.split('.');
    if (e[0] === 'register') {
      throw new RangeError('"register" is a reserved function name for wrapi. Please use an alias (eg. "Register", "_register").');
    }

    // arguments order - param1, param2, ..., querystring?, body?, callback 
    function apiEndpoint() {

      var callback = [].pop.call(arguments);
      var body = null;
      if (['PATCH', 'POST', 'PUT'].indexOf(endPoint.method) >= 0) {
        body = [].pop.call(arguments);
      }
      var qs = endPoint.query || {};
      if (arguments.length > 0 && typeof arguments[arguments.length - 1] === 'object') {
        qs = extend(qs, [].pop.call(arguments));
      }

      var epBaseUrl = baseURL;
      var route = endPoint.path;
      // If url overriden for endpoint
      if (endPoint.url) {
        var urlObj = url.parse(endPoint.url);
        route = urlObj.path;
        urlObj.pathname = null;
        epBaseUrl = url.format(urlObj);
      }

      var args = arguments;
      // If path had place holders, arguments contain values
      var placeholders = [];
      var regexp = pattern.parse(route, placeholders);
      var values = {};
      placeholders.forEach(function(ph) {
        values[ph.name] = [].shift.call(args);
      });
      try {
        var path = pattern.transform(route, values);
      }
      catch (e) {
        callback(e);
        return;
      }

      var apiUrl = url.resolve(epBaseUrl, path);
      api(endPoint.method || 'GET', apiUrl, qs, callback, body);
    };

    nest(self, e, apiEndpoint);

    return self;
  }

  // Create methods for supported endpoints
  for (var e in endpoints) {
    defineEndpoint(e, endpoints[e]);
  }

}

module.exports = wrapi;
module.exports.version = '1.0.0';
