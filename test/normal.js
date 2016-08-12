var Router      = require('../')
  , restify     = require('restify')
  , _           = require('underscore')
  , assert      = require('assert');

var noop = function(req, res, next) {
  next();
};

var ctls = {
  list: noop,
  detail: noop,
  modify: noop,
  remove: [noop, noop, noop],
  add: noop
};

var server = restify.createServer();
var checker = function(path) {
  var methods = [].slice.call(arguments, 1);
  it("path is string", function(done) {
    assert.ok(_.isString(path))
    done();
  });
  it("methods is arrray, function", function(done) {
    _.each(methods, function(method) {
      assert.ok(_.isFunction(method))
    });
    done();
  });
};

server.get = checker;
server.put = checker;
server.patch = checker;
server.del = checker;
server.post = checker;

var router = Router(server, {user: ctls});

describe("Router normal", function() {
  describe("get", function() {
    router.get('/users', "user#list");
  });

  describe("put", function() {
    router.put('/users/:id', "user#modify");
  });

  describe("patch", function() {
    router.patch('/users/:id', "user#modify");
  });

  describe("post", function() {
    router.post('/users', "user#add");
  });

  describe("del", function() {
    router.del('/users/:id', "user#remove");
  });
});
