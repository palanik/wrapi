'use strict';

var request = require('request');
var pattern = require('urlpattern').express;
var extend = require('extend');
var url = require('url');
var nest = require('./utils').nest;

var Promise = Promise || require('es6-promise').Promise;

function wrapi(baseURL, endpoints, opts) {
  opts = opts || {};
  if (!opts.qs) {
    opts.qs = {};
  }

  endpoints = endpoints || {};

  this.register = defineEndpoint;
  
  var self = this;

  function api(method, path, qs, callback, content) {
    // request function for "DELETE" is .del - https://github.com/request/request#requestdel
    method = (method == 'DELETE') ? 'DEL' : method;
    var apiUrl = url.resolve(baseURL, path);

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
                callback(null, body, r);
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
      // If no callback provided, return a Promise.
      if (typeof callback !== 'function') {
        [].push.call(arguments, callback);

        var args = arguments;
        var prom = new Promise(function(resolve, reject) {
          callback = function(err, data) {
            if (err) {
              return reject(err);
            }
            else {
              return resolve(data);
            }
          };

          [].push.call(args, callback);
          apiEndpoint.apply(this, args);  // recursively call self with callback added
        });
        return prom;
      }

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
