wrapi
=====
Wrap Restful APIs as callable functions.

**`wrapi`** allows you to make calls to HTTP based APIs like ordinary JavaScript functions.

[![NPM version](https://img.shields.io/npm/v/wrapi.svg?style=flat)](https://www.npmjs.org/package/wrapi)
[![Build Status](https://img.shields.io/travis/palanik/wrapi.svg?style=flat)](https://travis-ci.org/palanik/wrapi.svg)

## Installation

```sh
$ npm install wrapi
```

## Easy Start

### Approach `A`
1. Create a [JSON file](#json-file) listing all the endpoints of the API you want to work with.
2. [Wrap](#wrap-endpoints) endpoints with **`wrapi`**.
3. Call individual endpoints as [functions](#make-the-call).

See [Sample Code](examples/github/sample1.js)

### Approach `B`
1. Create [client object](#client-object) with API Base URL.
2. [Register](#register) API endpoints.
3. Call individual endpoints as [functions](#make-the-call).

See [Sample Code](examples/github/sample2.js)

------

### JSON File
Declare each endpoint as per the following specifications.

```js
"function_name": {
	"method": "HTTP_METHOD",					// 'GET', 'POST', 'PUT', 'PATCH' or 'DELETE'
	"path": "relative/path/to/:api/endpoint"	// Use `express` style path params
}
```

eg. a small set of github.com API
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
var endpoints = require('./github.api.json');
var wrapi = require('wrapi');

var client = new wrapi('https://api.github.com/',	// base url for the API
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
Call the functions with arguments and a callback.

```js
// This will make GET request to 'https://api.github.com/repos/nodejs/node/contributors'
client.contributors('nodejs', 'node', function(err, contributors) {
  if (!err) {
  	console.log(contributors);
  }
}

client.zen(function(err, response) {
  if (!err) {
    console.log('Chris says "' + response + '"');
  }
});

```

## API

**`wrapi`** is not restricted any one or a set of public APIs. All APIs providing HTTP interface to access the endpoints can be wrapped by **`wrapi`** so that you can quickly build your client application.

### Client object

The **`wrapi`** object conventionally provides the client interface to the API. Create it by calling `new` **`wrapi()`**.

The constructor takes the following arguments:

1. `baseURL` - The base url for the API. eg. `https://api.github.com/repos/nodejs/node/contributors`
2. `endpoints` - The JSON object listing the endpoints of the API. Provide `{}` - empty object or partial list and `register` endpoints later.
3. `options` - Optional parameter. **`wrapi`** uses [request](https://www.npmjs.com/package/request) module to connect to API server. The `options` parameter is the same [`options`](https://www.npmjs.com/package/request#requestoptions-callback) parameter used in `request`.

### Register function

Add endpoints to client object.
```
register(function_name, endpoint_definition)
```

1. `function_name` - Alias for the endpoint, also the function name to call.
2. `endpoint_definition` - JSON object defining the endpoint.


### Function calls

Call the API via the function in the client object.  Arguments to the function depends on the API declaration in the JSON. Provide the arguments in the following order:

1. params in the path of the endpoint. eg. `client.contributors('nodejs', 'node',   // nodejs & node are path params`
2. `querystring` as an object with name-value pairs. eg. `client.repositories({since:364}  // querystring ?since=364`
3. `body` - JSON content for  `POST` or `PUT` methods. Skip this argument if not required. 
4. `callback(err, data)` - a callback function for the results to be returned. The callback is called when the response is fetched or an error occcured. This callback function gets the results of the response.

## Examples

	In examples folder.

## License

  [MIT](LICENSE)
