'use strict';

var request = require('request');
var pattern = require('urlpattern').express;

function wrapi(baseURL, endpoints, opts) {
  opts = opts || {};
  if (!opts.qs) {
    opts.qs = {};
  }

  endpoints = endpoints || {};

  this.register = defineEndpoint;
  
  // utility method to override params
  function override(o1, o2) {
    for (var k in o1) {
      o2[k] = o1[k];
    }
    return o2;
  }

  var self = this;

  function api(method, path, qs, callback, content) {
    // request function for "DELETE" is .del - https://github.com/request/request#requestdel
    method = (method == 'DELETE') ? 'DEL' : method;
    var url = baseURL + path;

    opts.qs = override(qs, opts.qs);
    if (content) {
      opts.body = content;
    }

    if (!opts.headers) {
      opts.headers = {};
    }
    if (!opts.headers['User-Agent']) {
      opts.headers['User-Agent'] = 'wrapi-client';
    }

    request[method.toLowerCase()](url,
            opts,
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

                  }
                }
                callback(null, body, r);
              }
            }
          );
  }

  // 
  function defineEndpoint(e, endPoint) {
    if (e === 'register') {
      throw new RangeError('"register" is a reserved function name for wrapi. Please use an alias (eg. "Register", "_register").')
    }
    // arguments order - param1, param2, ..., querystring?, body?, callback 
    self[e] = function() {

      var callback = [].pop.call(arguments);
      var body = null;
      if (['PATCH', 'POST', 'PUT'].indexOf(endPoint.method) >= 0) {
        body = [].pop.call(arguments);
      }
      var qs = {};
      if (arguments.length > 0 && typeof arguments[arguments.length - 1] === 'object') {
        qs = [].pop.call(arguments);
      }

      var args = arguments;
      // If path had place holders, arguments contain values
      var placeholders = [];
      var regexp = pattern.parse(endPoint.path, placeholders);
      var values = {};
      placeholders.forEach(function(ph) {
        values[ph.name] = [].shift.call(args);
      });
      try {
        var path = pattern.transform(endPoint.path, values);
      }
      catch (e) {
        callback(e);
        return;
      }

      api(endPoint.method, path, qs, callback, body);      
    };

    return self;
  }

  // Create methods for supported endpoints
  for (var e in endpoints) {
    defineEndpoint(e, endpoints[e]);
  }

}

module.exports = wrapi;
module.exports.version = '1.0.0';
