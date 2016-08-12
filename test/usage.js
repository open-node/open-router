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

var noop = function(name, except, error) {
  return function(req, res, next) {
    if (except) throw except;
    next(error);
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

var defaults = {
  list:   function(ctl) { return noop('defaults-' + ctl + '-list'); },
  detail: function(ctl) { return noop('defaults-' + ctl + '-detail'); },
  modify: function(ctl) { return noop('defaults-' + ctl + '-modify'); },
  remove: function(ctl) { return noop('defaults-' + ctl + '-remove'); },
  add:    function(ctl) { return noop('defaults-' + ctl + '-add'); }
};

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

  describe("defaults controller", function() {
    it("user defaults collection", function(done) {
      router = Router(server, ctls, defaults);
      router.collection('book');

      var ret = queue.shift();
      assert.equal('/books', ret[0], 'path check');
      assert.equal('defaults-book-list', ret[1][0](req, res, next), 'method check');
      assert.equal('GET', ret[2], 'verb check');

      var ret = queue.shift();
      assert.equal('/books', ret[0], 'path check');
      assert.equal('defaults-book-add', ret[1][0](req, res, next), 'method check');
      assert.equal('POST', ret[2], 'verb check');

      done();
    });

    it("user defaults model", function(done) {
      router = Router(server, ctls, defaults);
      router.model('book');

      var ret = queue.shift();
      assert.equal('/books/:id', ret[0], 'path check');
      assert.equal('defaults-book-detail', ret[1][0](req, res, next), 'method check');
      assert.equal('GET', ret[2], 'verb check');

      var ret = queue.shift();
      assert.equal('/books/:id', ret[0], 'path check');
      assert.equal('defaults-book-modify', ret[1][0](req, res, next), 'method check');
      assert.equal('PUT', ret[2], 'verb check');

      var ret = queue.shift();
      assert.equal('/books/:id', ret[0], 'path check');
      assert.equal('defaults-book-modify', ret[1][0](req, res, next), 'method check');
      assert.equal('PATCH', ret[2], 'verb check');

      var ret = queue.shift();
      assert.equal('/books/:id', ret[0], 'path check');
      assert.equal('defaults-book-remove', ret[1][0](req, res, next), 'method check');
      assert.equal('DELETE', ret[2], 'verb check');

      done();
    });

  });

  describe("router regist exceptions", function() {
    router = Router(server, ctls);
    it("action non-exists", function(done) {
      assert.throws(function() {
        router.post('/books/:bookId/order', 'book#buy');
      }, function(err) {
        return err instanceof Error && err.message === 'Missing controller method:book#buy'
      });
      queue.shift();

      done();
    });
  });

  describe("apis defined", function() {
    it("check apis", function(done) {
      router = Router(server, ctls, null, {apis: '/_apis'});
      var ret = queue.shift();
      router.resource('user');
      var send = function(apis) {
        assert.ok(apis instanceof Array);
        assert.equal(6, apis.length);
      };
      assert.equal('/_apis', ret[0], 'path check');
      assert.ok(ret[1][0] instanceof Function);
      ret[1][0](req, {send: send}, next);
      assert.equal('GET', ret[2], 'verb check');
      queue = [];
      done();
    });
  });

  describe("function exec exception", function() {
    it("check throw Errror", function(done) {
      router = Router(server, {
        user: {
          detail: noop('user-detail', Error('Has error'))
        }
      });
      router.get('/user/:id', 'user#detail')
      var ret = queue.shift();
      assert.equal('/user/:id', ret[0], 'path check');
      assert.ok(ret[1][0] instanceof Function);
      assert.equal('GET', ret[2], 'path check');
      _error = console.error
      console.error = function() {};
      var fnName = ret[1][0](req, res, function(err) {
        assert.equal('Has error', err.message);
      });
      console.error = _error;
      done();
    });
  });

  describe("logic or test", function() {
    it("logic or last one passed", function(done) {
      router = Router(server, {
        user: {
          detail: [
            [
              noop('logic-or-1', null, Error('Not allowed')),
              noop('logic-or-2', null, Error('Not allowed')),
              noop('logic-or-3')
            ]
          ]
        }
      });
      router.get('/users/:id', 'user#detail');
      var ret = queue.shift();
      assert.equal('/users/:id', ret[0], 'path check');
      assert.ok(ret[1] instanceof Array);
      assert.equal(1, ret[1].length);
      assert.ok(ret[1][0] instanceof Function);
      assert.equal('GET', ret[2], 'verb check');

      ret[1][0](req, res, function(error) {
        assert.equal(undefined, error);
      });

      done();
    });

    it("logic or no passed", function(done) {
      router = Router(server, {
        user: {
          detail: [
            [
              noop('logic-or-1', null, Error('Not allowed 1')),
              noop('logic-or-2', null, Error('Not allowed 2')),
              noop('logic-or-3', null, Error('Not allowed 3'))
            ]
          ]
        }
      });
      router.get('/users/:id', 'user#detail');
      var ret = queue.shift();
      assert.equal('/users/:id', ret[0], 'path check');
      assert.ok(ret[1] instanceof Array);
      assert.equal(1, ret[1].length);
      assert.ok(ret[1][0] instanceof Function);
      assert.equal('GET', ret[2], 'verb check');

      ret[1][0](req, res, function(error) {
        assert.equal('Not allowed 1', error.message);
        assert.ok(error instanceof Error);
      });

      done();
    });

    it("logic or first passed", function(done) {
      router = Router(server, {
        user: {
          detail: [
            [
              noop('logic-or-1'),
              noop('logic-or-2', null, Error('Not allowed 2')),
              noop('logic-or-3', null, Error('Not allowed 3'))
            ]
          ]
        }
      });
      router.get('/users/:id', 'user#detail');
      var ret = queue.shift();
      assert.equal('/users/:id', ret[0], 'path check');
      assert.ok(ret[1] instanceof Array);
      assert.equal(1, ret[1].length);
      assert.ok(ret[1][0] instanceof Function);
      assert.equal('GET', ret[2], 'verb check');

      ret[1][0](req, res, function(error) {
        assert.equal(undefined, error);
      });

      done();
    });

    it("logic or 2th passed", function(done) {
      router = Router(server, {
        user: {
          detail: [
            [
              noop('logic-or-1', null, Error('Not allowed 1')),
              noop('logic-or-2'),
              noop('logic-or-3', null, Error('Not allowed 3'))
            ]
          ]
        }
      });
      router.get('/users/:id', 'user#detail');
      var ret = queue.shift();
      assert.equal('/users/:id', ret[0], 'path check');
      assert.ok(ret[1] instanceof Array);
      assert.equal(1, ret[1].length);
      assert.ok(ret[1][0] instanceof Function);
      assert.equal('GET', ret[2], 'verb check');

      ret[1][0](req, res, function(error) {
        assert.equal(undefined, error);
      });

      done();
    });
  });

});
