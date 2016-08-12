# open-router
==================

A router for restify or framework based on restify.

[![Build status](https://api.travis-ci.org/open-node/open-router.svg?branch=master)](https://travis-ci.org/open-node/open-router)
[![codecov](https://codecov.io/gh/open-node/open-router/branch/master/graph/badge.svg)](https://codecov.io/gh/open-node/open-router)

## Usage
<pre>npm install open-router --save</pre>

## Example router definition
```js
var Router = require('open-router');

/**
 * @return router instance
 *
 * @params server
 *     restify.createServer() return result
 * @params controllers
 *     All controllers object,
 *      {
 *        controllerName: {
 *          methodName: method
 *        }
 *      }
 * @params defaultCtl
 *    {
 *      list: function() {},
 *      modify: function() {},
 *      detail: function() {},
 *      remove: function() {},
 *      add: function() {}
 *    }
 * @params opts
 *          apis The uri list all rest api;
 */
var router = Router(server, controllers, defaultCtl, opts);

```

## Methods

### router.get(routePath, actionPath)

HTTP.verb `GET`

Equivalent to

GET: /routePath


__Arguments__
* `routePath` - uri ，eg `/users/:id` or `/users/:userId/books`
* `actionPath` - controllerMethodPath，eg.`user#detail` { user: detail: function() {} }

__Example__
```js
router.get('/users', 'user#list'); When request `/users` by GET, user controller's `list` method will be called.

```

### router.put(routePath, actionPath)

HTTP.verb `PUT`

Equivalent to

PUT: /routePath


__Arguments__
* `routePath` - uri ，eg `/users/:id` or `/users/:userId/books`
* `actionPath` - controllerMethodPath，eg.`user#detail` { user: detail: function() {} }

__Example__
```js
router.get('/users/:id', 'user#modify'); When request `/users/:id` by PUT, user controller's `modify` method will be called.

```

### router.patch(routePath, actionPath)

HTTP.verb `PATCH`

Equivalent to

PATCH: /routePath

### router.post(routePath, actionPath)

HTTP.verb `POST`

Equivalent to

POST: /routePath


### router.del(routePath, actionPath)

HTTP.verb `DELETE`

Equivalent to

DELETE: /routePath

### router.resource(name, routePath)

HTTP.verb `DELETE` or `GET` or `PATCH` or `PUT`

Equivalent to

POST: /routePath
PUT: /routePath/:id
PATCH: /routePath/:id
GET: /routePath
GET: /routePath/:id
DELETE: /routePath/:id

__Arguments__

* `name` - Response's name. eg: `user`, `book`, `order`
* `routePath` - optional, uri


__Example__

```js
router.resource('user')

// Equivalent to
// router.get('/users', 'user#list');
// router.get('/users/:id', 'user#detail');
// router.put('/users/:id', 'user#modify');
// router.patch('/users/:id', 'user#modify');
// router.delete('/users/:id', 'user#remove');
// router.post('/users', 'user#add');
```

### router.model(name, routePath)

HTTP.verb `DELETE` or `GET` or `PATCH` or `PUT`

Equivalent to

PUT: /routePath
PATCH: /routePath
GET: /routePath
DELETE: /routePath


__Arguments__

* `name` - Response's name. eg: `user`, `book`, `order`
* `routePath` - optional, uri

__Example__

```js
router.model('user')

// Equivalent to
// router.get('/users/:id', 'user#detail');
// router.put('/users/:id', 'user#modify');
// router.patch('/users/:id', 'user#modify');
// router.delete('/users/:id', 'user#remove');

router.model('user', '/systems/users')

// Equivalent to
// router.get('/systems/users/:id', 'user#detail');
// router.put('/systems/users/:id', 'user#modify');
// router.patch('/systems/users/:id', 'user#modify');
// router.delete('/systems/users/:id', 'user#remove');
```

### router.collection(name, routePath)

HTTP.verb `DELETE` or `GET` or `PATCH` or `PUT`

Equivalent to

// List the resource
GET: /routePath
// Create a resource
POST: /routePath


__Arguments__

* `name` - Response's name. eg: `user`, `book`, `order`
* `routePath` - optional, uri
* `parent` - optional, The resource's parent resource name

__Example__

```js
router.collection('book', null, 'user')

// Equivalent to

// router.get('/users/:userId/books', 'user#books');
// router.post('/users/:userId/books', 'user#addBook');

router.collection('book', '/users/:creatorId/books', 'user')

// Equivalent to

// router.get('/users/:creatorId/books', 'user#books');
// router.post('/users/:creatorId/books', 'user#addBook');
```
