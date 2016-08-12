var Router      = require('../')
  , restify     = require('restify')
  , _           = require('underscore')
  , assert      = require('assert');

var req = {
  route: {},
};
var res = {
  send: function() {}
};
var next = function() {};

var noop = function(name) {
  return function(req, res, next) {
    next();
    return name;
  };
};

var ctls = {
  list: noop('list'),
  detail: noop('detail'),
  modify: noop('modify'),
  remove: [
    noop('remove1'),
    noop('remove2'),
    noop('remove3')
  ],
  add: noop('add')
};

var queue = [];
var server = restify.createServer();
var checker = function(path) {
  var methods = [].slice.call(arguments, 1);
  queue.push([path, methods]);
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
    it("check regist result", function(done) {
      var ret = queue.shift();
      assert.equal('/users', ret[0], 'path check');
      assert.equal('list', ret[1][0](req, res, next), 'method check');
      done();
    });
  });

  describe("put", function() {
    router.put('/users/:id', "user#modify");
    it("check regist result", function(done) {
      var ret = queue.shift();
      assert.equal('/users/:id', ret[0], 'path check');
      assert.equal('modify', ret[1][0](req, res, next), 'method check');
      done();
    });
  });

  describe("patch", function() {
    router.patch('/users/:id', "user#modify");
    it("check regist result", function(done) {
      var ret = queue.shift();
      assert.equal('/users/:id', ret[0], 'path check');
      assert.equal('modify', ret[1][0](req, res, next), 'method check');
      done();
    });
  });

  describe("post", function() {
    router.post('/users', "user#add");
    it("check regist result", function(done) {
      var ret = queue.shift();
      assert.equal('/users', ret[0], 'path check');
      assert.equal('add', ret[1][0](req, res, next), 'method check');
      done();
    });
  });

  describe("del", function() {
    router.del('/users/:id', "user#remove");
    it("check regist result", function(done) {
      var ret = queue.shift();
      assert.equal('/users/:id', ret[0], 'path check');
      assert.equal('remove1', ret[1][0](req, res, next), 'method check1');
      assert.equal('remove2', ret[1][1](req, res, next), 'method check2');
      assert.equal('remove3', ret[1][2](req, res, next), 'method check3');
      done();
    });
  });
});
