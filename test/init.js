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

describe("Router init", function() {
  describe("Argument server error", function() {
    it("type error", function(done) {
      assert.throws(function() {
        Router({}, {});
      }, function(err) {
        return err instanceof Error && err.message === 'Argument `server` must be restify.createServer()'
      });
      done();
    });
  });
});

