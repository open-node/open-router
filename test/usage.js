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
  user: {
    list: noop('list'),
    detail: noop('detail'),
    modify: noop('modify'),
    remove: [
      noop('remove1'),
      noop('remove2'),
      noop('remove3')
    ],
    add: noop('add')
  },
  company: {
    users: noop('company-list-user'),
    addUser: noop('company-add-user')
  }
};

var queue = [];
var server = restify.createServer();
var checker = function(verb) {
  return function(path) {
    var methods = [].slice.call(arguments, 1);
    queue.push([path, methods, verb]);
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
};

server.get = checker('GET');
server.put = checker('PUT');
server.patch = checker('PATCH');
server.del = checker('DELETE');
server.post = checker('POST');

var router = Router(server, ctls);

describe("Router usage", function() {
  describe("get", function() {
    router.get('/users', "user#list");
    it("check regist result", function(done) {
      var ret = queue.shift();
      assert.equal('/users', ret[0], 'path check');
      assert.equal('list', ret[1][0](req, res, next), 'method check');
      assert.equal('GET', ret[2], 'verb check');
      done();
    });
  });

  describe("put", function() {
    router.put('/users/:id', "user#modify");
    it("check regist result", function(done) {
      var ret = queue.shift();
      assert.equal('/users/:id', ret[0], 'path check');
      assert.equal('modify', ret[1][0](req, res, next), 'method check');
      assert.equal('PUT', ret[2], 'verb check');
      done();
    });
  });

  describe("patch", function() {
    router.patch('/users/:id', "user#modify");
    it("check regist result", function(done) {
      var ret = queue.shift();
      assert.equal('/users/:id', ret[0], 'path check');
      assert.equal('modify', ret[1][0](req, res, next), 'method check');
      assert.equal('PATCH', ret[2], 'verb check');
      done();
    });
  });

  describe("post", function() {
    router.post('/users', "user#add");
    it("check regist result", function(done) {
      var ret = queue.shift();
      assert.equal('/users', ret[0], 'path check');
      assert.equal('add', ret[1][0](req, res, next), 'method check');
      assert.equal('POST', ret[2], 'verb check');
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
      assert.equal('DELETE', ret[2], 'verb check');
      done();
    });
  });

  describe("resource path unset", function() {
    router.resource('user');
    it("check regist result list", function(done) {
      var ret = queue.shift();
      assert.equal('/users', ret[0], 'path check');
      assert.equal('list', ret[1][0](req, res, next), 'method check');
      assert.equal('GET', ret[2], 'verb check');
      done()
    });

    it("check regist result add", function(done) {
      var ret = queue.shift();
      assert.equal('/users', ret[0], 'path check');
      assert.equal('add', ret[1][0](req, res, next), 'method check');
      assert.equal('POST', ret[2], 'verb check');
      done()
    });

    it("check regist result detail", function(done) {
      var ret = queue.shift();
      assert.equal('/users/:id', ret[0], 'path check');
      assert.equal('detail', ret[1][0](req, res, next), 'method check');
      assert.equal('GET', ret[2], 'verb check');
      done()
    });

    it("check regist result put modify", function(done) {
      var ret = queue.shift();
      assert.equal('/users/:id', ret[0], 'path check');
      assert.equal('modify', ret[1][0](req, res, next), 'method check');
      assert.equal('PUT', ret[2], 'verb check');
      done()
    });

    it("check regist result patch modify", function(done) {
      var ret = queue.shift();
      assert.equal('/users/:id', ret[0], 'path check');
      assert.equal('modify', ret[1][0](req, res, next), 'method check');
      assert.equal('PATCH', ret[2], 'verb check');
      done()
    });

    it("check regist result remove", function(done) {
      var ret = queue.shift();
      assert.equal('/users/:id', ret[0], 'path check');
      assert.equal('remove1', ret[1][0](req, res, next), 'method check1');
      assert.equal('remove2', ret[1][1](req, res, next), 'method check2');
      assert.equal('remove3', ret[1][2](req, res, next), 'method check3');
      assert.equal('DELETE', ret[2], 'verb check');
      done();
    });

  });

  describe("resource path set", function() {
    router.resource('user', '/companys/users');
    it("check regist result list", function(done) {
      var ret = queue.shift();
      assert.equal('/companys/users', ret[0], 'path check');
      assert.equal('list', ret[1][0](req, res, next), 'method check');
      assert.equal('GET', ret[2], 'verb check');
      done()
    });

    it("check regist result add", function(done) {
      var ret = queue.shift();
      assert.equal('/companys/users', ret[0], 'path check');
      assert.equal('add', ret[1][0](req, res, next), 'method check');
      assert.equal('POST', ret[2], 'verb check');
      done()
    });

    it("check regist result detail", function(done) {
      var ret = queue.shift();
      assert.equal('/companys/users/:id', ret[0], 'path check');
      assert.equal('detail', ret[1][0](req, res, next), 'method check');
      assert.equal('GET', ret[2], 'verb check');
      done()
    });

    it("check regist result put modify", function(done) {
      var ret = queue.shift();
      assert.equal('/companys/users/:id', ret[0], 'path check');
      assert.equal('modify', ret[1][0](req, res, next), 'method check');
      assert.equal('PUT', ret[2], 'verb check');
      done()
    });

    it("check regist result patch modify", function(done) {
      var ret = queue.shift();
      assert.equal('/companys/users/:id', ret[0], 'path check');
      assert.equal('modify', ret[1][0](req, res, next), 'method check');
      assert.equal('PATCH', ret[2], 'verb check');
      done()
    });

    it("check regist result remove", function(done) {
      var ret = queue.shift();
      assert.equal('/companys/users/:id', ret[0], 'path check');
      assert.equal('remove1', ret[1][0](req, res, next), 'method check1');
      assert.equal('remove2', ret[1][1](req, res, next), 'method check2');
      assert.equal('remove3', ret[1][2](req, res, next), 'method check3');
      assert.equal('DELETE', ret[2], 'verb check');
      done();
    });

  });

  describe("collection path set has parent resource", function() {
    router.collection('user', '/company/:companyId/users', 'company');
    it("check regist result list", function(done) {
      var ret = queue.shift();
      assert.equal('/company/:companyId/users', ret[0], 'path check');
      assert.equal('company-list-user', ret[1][0](req, res, next), 'method check');
      assert.equal('GET', ret[2], 'verb check');
      done()
    });

    it("check regist result add", function(done) {
      var ret = queue.shift();
      assert.equal('/company/:companyId/users', ret[0], 'path check');
      assert.equal('company-add-user', ret[1][0](req, res, next), 'method check');
      assert.equal('POST', ret[2], 'verb check');
      done()
    });
  });

  describe("collection path unset has parent resource", function() {
    router.collection('user', null, 'company');
    it("check regist result list", function(done) {
      var ret = queue.shift();
      assert.equal('/companys/:companyId/users', ret[0], 'path check');
      assert.equal('company-list-user', ret[1][0](req, res, next), 'method check');
      assert.equal('GET', ret[2], 'verb check');
      done()
    });

    it("check regist result add", function(done) {
      var ret = queue.shift();
      assert.equal('/companys/:companyId/users', ret[0], 'path check');
      assert.equal('company-add-user', ret[1][0](req, res, next), 'method check');
      assert.equal('POST', ret[2], 'verb check');
      done()
    });
  });

  describe("collection path set has no parent resource", function() {
    router.collection('user', '/company/:companyId/users');
    it("check regist result list", function(done) {
      var ret = queue.shift();
      assert.equal('/company/:companyId/users', ret[0], 'path check');
      assert.equal('list', ret[1][0](req, res, next), 'method check');
      assert.equal('GET', ret[2], 'verb check');
      done()
    });

    it("check regist result add", function(done) {
      var ret = queue.shift();
      assert.equal('/company/:companyId/users', ret[0], 'path check');
      assert.equal('add', ret[1][0](req, res, next), 'method check');
      assert.equal('POST', ret[2], 'verb check');
      done()
    });
  });

  describe("collection path unset has no parent resource", function() {
    router.collection('user');
    it("check regist result list", function(done) {
      var ret = queue.shift();
      assert.equal('/users', ret[0], 'path check');
      assert.equal('list', ret[1][0](req, res, next), 'method check');
      assert.equal('GET', ret[2], 'verb check');
      done()
    });

    it("check regist result add", function(done) {
      var ret = queue.shift();
      assert.equal('/users', ret[0], 'path check');
      assert.equal('add', ret[1][0](req, res, next), 'method check');
      assert.equal('POST', ret[2], 'verb check');
      done()
    });
  });

  describe("model path set", function() {
    router.model('user', '/companys/users/:id');
    it("check regist result detail", function(done) {
      var ret = queue.shift();
      assert.equal('/companys/users/:id', ret[0], 'path check');
      assert.equal('detail', ret[1][0](req, res, next), 'method check');
      assert.equal('GET', ret[2], 'verb check');
      done()
    });

    it("check regist result put modify", function(done) {
      var ret = queue.shift();
      assert.equal('/companys/users/:id', ret[0], 'path check');
      assert.equal('modify', ret[1][0](req, res, next), 'method check');
      assert.equal('PUT', ret[2], 'verb check');
      done()
    });

    it("check regist result patch modify", function(done) {
      var ret = queue.shift();
      assert.equal('/companys/users/:id', ret[0], 'path check');
      assert.equal('modify', ret[1][0](req, res, next), 'method check');
      assert.equal('PATCH', ret[2], 'verb check');
      done()
    });

    it("check regist result remove", function(done) {
      var ret = queue.shift();
      assert.equal('/companys/users/:id', ret[0], 'path check');
      assert.equal('remove1', ret[1][0](req, res, next), 'method check1');
      assert.equal('remove2', ret[1][1](req, res, next), 'method check2');
      assert.equal('remove3', ret[1][2](req, res, next), 'method check3');
      assert.equal('DELETE', ret[2], 'verb check');
      done();
    });
  });

  describe("model path unset", function() {
    router.model('user');
    it("check regist result detail", function(done) {
      var ret = queue.shift();
      assert.equal('/users/:id', ret[0], 'path check');
      assert.equal('detail', ret[1][0](req, res, next), 'method check');
      assert.equal('GET', ret[2], 'verb check');
      done()
    });

    it("check regist result put modify", function(done) {
      var ret = queue.shift();
      assert.equal('/users/:id', ret[0], 'path check');
      assert.equal('modify', ret[1][0](req, res, next), 'method check');
      assert.equal('PUT', ret[2], 'verb check');
      done()
    });

    it("check regist result patch modify", function(done) {
      var ret = queue.shift();
      assert.equal('/users/:id', ret[0], 'path check');
      assert.equal('modify', ret[1][0](req, res, next), 'method check');
      assert.equal('PATCH', ret[2], 'verb check');
      done()
    });

    it("check regist result remove", function(done) {
      var ret = queue.shift();
      assert.equal('/users/:id', ret[0], 'path check');
      assert.equal('remove1', ret[1][0](req, res, next), 'method check1');
      assert.equal('remove2', ret[1][1](req, res, next), 'method check2');
      assert.equal('remove3', ret[1][2](req, res, next), 'method check3');
      assert.equal('DELETE', ret[2], 'verb check');
      done();
    });
  });
});
