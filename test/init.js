var Router      = require('../')
  , restify     = require('restify')
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

describe("Router init", function() {

  describe("Argument server error", function() {
    it("type error", function(done) {
      assert.throws(function() {
        Router({});
      }, function(err) {
        return err instanceof Error && err.message === 'Argument `server` must be restify.createServer()'
      });
      done();
    });
    it("chainning type error", function(done) {
      assert.throws(function() {
        Router.server({}).exec();
      }, function(err) {
        return err instanceof Error && err.message === 'Argument `server` must be restify.createServer()'
      });
      done();
    });
  });

  describe("Argument ctls error", function() {

    it("type error", function(done) {
      assert.throws(function() {
        Router(server, 'hello');
      }, function(err) {
        return err instanceof Error && err.message === 'Argument `ctls` type must be `Object`'
      });
      done();
    });

    it("chainning type error", function(done) {
      assert.throws(function() {
        Router.server(server).ctls('hello').exec();
      }, function(err) {
        return err instanceof Error && err.message === 'Argument `ctls` type must be `Object`'
      });
      done();
    });

    it("ctls input array", function(done) {
      assert.throws(function() {
        Router.server(server).ctls(['hello', 'world']).exec();
      }, function(err) {
        return err instanceof Error && err.message === 'Argument `ctls` must be a hash, key is string 0'
      });
      done();
    });

    it("ctls controller input array", function(done) {
      assert.throws(function() {
        Router.server(server).ctls({user: ['hello', 'world']}).exec();
      }, function(err) {
        return err instanceof Error && err.message === 'Argument `ctls` validate error, controller name must be a string'
      });
      done();
    });

    it("ctls controller methods string", function(done) {
      assert.throws(function() {
        Router.server(server).ctls({user: {modify: 'hello'}}).exec();
      }, function(err) {
        return err instanceof Error && err.message === 'Argument `ctls` validate error, controller method must be an Array or a Function'
      });
      done();
    });

    it("ctls controller methods array string", function(done) {
      assert.throws(function() {
        Router.server(server).ctls({user: {modify: ['hello']}}).exec();
      }, function(err) {
        return err instanceof Error && err.message === 'Argument `ctls` validate error, controller method must be an Array or a Function'
      });
      done();
    });
  });

  describe("Argument defaults error", function() {
    it("type error", function(done) {
      assert.throws(function() {
        Router(server, {user: {modify: noop}}, 'hello');
      }, function(err) {
        return err instanceof Error && err.message === 'Argument `defaults` type must be `Object`'
      });
      done();
    });

    it("chainning type error", function(done) {
      assert.throws(function() {
        Router.server(server).ctls({user: {modify: noop}}).defaults('hello').exec();
      }, function(err) {
        return err instanceof Error && err.message === 'Argument `defaults` type must be `Object`'
      });
      done();
    });

    it("defaults controller input array", function(done) {
      assert.throws(function() {
        Router.server(server).ctls({user: ctls}).defaults(['hello world']).exec();
      }, function(err) {
        return err instanceof Error && err.message === 'Argument `defaults` validate error, controller name must be a string'
      });
      done();
    });

    it("defaults controller methods string", function(done) {
      assert.throws(function() {
        Router.server(server).ctls({user: ctls}).defaults({detail: 'hello world'}).exec();
      }, function(err) {
        return err instanceof Error && err.message === 'Argument `defaults` validate error, controller method must be an Array or a Function'
      });
      done();
    });

    it("defaults controller methods array string", function(done) {
      assert.throws(function() {
        Router.server(server).ctls({user: ctls}).defaults({detail: ['hello world']}).exec();
      }, function(err) {
        return err instanceof Error && err.message === 'Argument `defaults` validate error, controller method must be an Array or a Function'
      });
      done();
    });

    it("defaults controller method name not allowed", function(done) {
      assert.throws(function() {
        Router.server(server).ctls({user: ctls}).defaults({name: noop}).exec();
      }, function(err) {
        return err instanceof Error && err.message === 'defaults only need add, list, detail, remove, modify'
      });
      done();
    });
  });

  describe("Argument opts error", function() {
    it("type error", function(done) {
      assert.throws(function() {
        Router.server(server).ctls({user: ctls}).opts('hello').exec();
      }, function(err) {
        return err instanceof Error && err.message === 'Argument `opts` type must be `Object`'
      });
      done();
    });
  });

  describe("Argument ctls logic or error", function() {
    it("type error", function(done) {
      assert.throws(function() {
        Router.server(server).ctls({
          user: {
            detail: [
              [noop, noop, 'hello']
            ]
          }
        }).exec();
      }, function(err) {
        return err instanceof Error && err.message === 'Argument `ctls` validate error, controller method must be an Array or a Function'
      });
      done();
    });
  });

  describe("Argument defaults type error in array", function() {
    it("type error", function(done) {
      assert.throws(function() {
        Router.server(server).ctls({user: ctls}).defaults({
          detail: [noop, noop, 'hello']
        }).exec();
      }, function(err) {
        return err instanceof Error && err.message === 'Argument `defaults` validate error, controller method must be an Array or a Function'
      });
      done();
    });
  });

});
