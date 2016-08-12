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
  remove: noop,
  add: noop
};

var server = restify.createServer();

server.get = function(path) {
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

var router = Router(server, {user: ctls});

describe("Router normal", function() {
  describe("get", function() {
    router.get('/users', "user#list");
  });
});

