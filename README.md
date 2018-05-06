wrapi
=====
Wrap Restful API endpoints as callable functions.

Create a Rest API SDK under 3 minutes.

[![NPM version](https://img.shields.io/npm/v/wrapi.svg?style=flat)](https://www.npmjs.org/package/wrapi)
[![Build Status](https://img.shields.io/travis/palanik/wrapi.svg?style=flat)](https://travis-ci.org/palanik/wrapi)
[![Coverage Status](https://coveralls.io/repos/palanik/wrapi/badge.svg?service=github)](https://coveralls.io/github/palanik/wrapi)
[![Known Vulnerabilities](https://snyk.io/test/github/palanik/wrapi/badge.svg)](https://snyk.io/test/github/palanik/wrapi)

With **`wrapi`** you make calls to HTTP based APIs just like ordinary JavaScript functions.
***

## Installation

```sh
$ npm install wrapi --save
```

Or

```sh
$ yarn add wrapi
```

## Easy Start

1. Create a [JSON file](#json-file) listing all API endpoints you want to work with.
2. [Wrap](#wrap-endpoints) endpoints with **`wrapi`**.
3. Call individual endpoints as [functions](#make-the-call).

See [Sample Code](examples/github/sample1.js)

------

### JSON File
Declare each endpoint in a json file as per the following specifications.

```js
"function_name": {
	"method": "HTTP_METHOD",					// 'GET', 'POST', 'PUT', 'PATCH' or 'DELETE'
	"path": "relative/path/to/:api/endpoint"	// Use `express` style path params
}
```

 E.g. a small set of github.com [API](https://developer.github.com/v3/repos/):
```json
{
	"repo": {
		"method" : "GET",
		"path" : "repos/:owner/:repo"
	},

	"contributors": {
		"method" : "GET",
		"path" : "repos/:owner/:repo/contributors"
	},

	"languages": {
		"method" : "GET",
		"path" : "repos/:owner/:repo/languages"
	},

	"tags": {
		"method" : "GET",
		"path" : "repos/:owner/:repo/tags"
	},

	"branches": {
		"method" : "GET",
		"path" : "repos/:owner/:repo/branches"
	}
}
```

### Wrap endpoints
Create a API client object from **`wrapi`**. Provide the base url for the API and the JSON object.
**`wrapi`** will create a client object with all the necessary functions.

```js
const endpoints = require('./github.api.json');
const wrapi = require('wrapi');

const client = new wrapi('https://api.github.com/',	// base url for the API
  endpoints 										// your json object
);

// client object contains functions to call the API
```

### Register
Register additional API endpoints with the client object with a function name.

```js
client.register('zen',
  {
    method : 'GET',
    path: 'zen'
  }
);
```

### Make the call
Call API function with arguments and a callback.

```js
// This will make GET request to 'https://api.github.com/repos/nodejs/node/contributors'
client.contributors('nodejs', 'node', function(err, contributors) {
  if (!err) {
  	console.log(contributors);
  }
});

client.zen(function(err, response) {
  if (!err) {
    console.log('Chris says "' + response + '"');
  }
});

```


## API

**`wrapi`** is an open ended framework. It is not restricted any specific or a set of APIs.

All APIs providing HTTP interface to access the endpoints can be wrapped by **`wrapi,`** so that you can quickly build your client application.

### Endpoint Definition

Note: `method` & `path`/`url` are required.

* `method` - Any one of the HTTP [methods](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html) (default: `"GET"`)
* `path` - route path to API Endpoint. Supports `express` style [path params](http://expressjs.com/en/4x/api.html#req.params)
* `query` - an object consists of name-value pairs. This is _optional_. This is useful where resources are identified via query string parameters
* `options` - options to override or to add specific to the API endpoint. E.g. `{encoding:null}` returns the response data as `Buffer`
* `url` - fully qualified uri string to override. This is useful in cases where an API call connects to a different endpoint


### Client object

The **`wrapi`** object conveniently provides the client interface to the API. Create the object by calling `new` **`wrapi()`**.

The constructor takes the following arguments:

1. `baseURL` - The base url for the API. E.g. `https://api.github.com/`
2. `endpoints` - The JSON object listing the API endpoints. Provide `{}` - empty object or a partial list and then `register` (additional) endpoints later
3. `options` - Optional parameter. **`wrapi`** uses [request](https://www.npmjs.com/package/request) module to connect to API server. The `options` parameter is the same [`options`](https://www.npmjs.com/package/request#requestoptions-callback) parameter used in `request`

#### Custom options
1. `catchHTTP4xx5xx` - Set this option to `true` to treat HTTP status 4xx & 5xx as errors. Default value is `false`. If set, the `err` argument in your callback function will contain the response body for 4xx & 5xx errors.

### Register function

Add endpoints to client object.
```
register(functionName, endpointDefinition)
```

1. `functionName` - Alias for the endpoint, also the name of the function to call.
2. `endpointDefinition` - JSON object defining the endpoint.


### Function calls

Call API endpoints via the function in the client object.  Arguments to the function depend on the API declaration in the JSON.

Provide the arguments in the following order:

1. named `params` in the url path of the endpoint. eg. `client.contributors('nodejs', 'node',   // nodejs & node are path params`
2. `query string` as an object with name-value pairs. eg. `client.repositories({since:364}  //  ?since=364`
3. `body` - JSON content for  `POST` or `PUT` methods. Skip this argument if not required for the call.
  * To **POST** `multipart/form-data`, set this argument as `{"formData" : multipartContent }`
4. `callback(err, data)` - a callback function for the results to be returned. The callback is called when the response is fetched or if there is an error. This callback function gets the results of the response.

    > To `pipe` the results, pass a [writable stream](https://nodejs.org/api/stream.html#stream_class_stream_writable) as the callback.
		Listen to `error` events on outputstream to catch streaming errors. See [example](examples/google/chartasstream.js).

## Examples

  In [examples](examples) folder.

## Implementations

* [Slack Web API](https://www.npmjs.com/package/slack-wrapi)
* [Square Connect API](https://www.npmjs.com/package/square-wrapi)
* [Medium](https://www.npmjs.com/package/medium-wrapi)
* [Twitter REST APIs](https://www.npmjs.com/package/twitter-wrapi)
* [Instagram API](https://www.npmjs.com/package/@wrapi/instagram)
* [Genius API](https://www.npmjs.com/package/@wrapi/genius)
* [GIPHY API](https://www.npmjs.com/package/giphy-wrapi)
* [Riffsy's API](https://www.npmjs.com/package/riffsy)
* [Pokémon API](https://www.npmjs.com/package/pokemon-wrapi)

## License

  [MIT](LICENSE)
