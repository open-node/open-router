var delegate  = require('func-delegate')
  , restify   = require('restify')
  , _         = require('underscore')
  , Router    = require('./lib/router');

var DEFAULT_METHODS = ['add', 'list', 'detail', 'remove', 'modify'];

var Server = restify.createServer().constructor;

module.exports = delegate(Router, [{
  name: 'server',
  type: Server,
  message: 'Argument `server` must be restify.createServer()'
}, {
  name: 'ctls',
  type: Object,
  validate: {
    check: function(values) {
      _.each(values, function(ctl, key) {
        if (!_.isString(key)) throw Error('Argument `ctls` must be a hash, key is string ' + key);
        _.each(ctl, function(methods, name) {
          if (!_.isString(name)) throw Error('Argument `ctls` validate error, controller name must be a string');
          if (_.isArray(methods)) {
            _.each(methods, function(method) {
              if (!_.isFunction(method)) throw Error('Argument `ctls` validate error, controller method must be an Array or a Function');
            });
          } else {
            if (!_.isFunction(methods)) throw Error('Argument `ctls` validate error, controller method must be an Array or a Function');
          }
        });
      });
      return true;
    }
  }
}, {
  name: 'defaults',
  type: Object,
  allowNull: true,
  validate: {
    check: function(value) {
      _.each(value, function(methods, name) {
        if (!_.isString(name)) throw Error('Argument `ctls` validate error, controller name must be a string');
        if (DEFAULT_METHODS.indexOf(name) === -1) {
          throw Error('defaults only need ' + DEFAULT_METHODS.join(', '));
        }
        if (_.isArray(methods)) {
          _.each(methods, function(method) {
            if (!_.isFunction(method)) throw Error('Argument `defaults` validate error, controller method must be an Array or a Function');
          });
        } else {
          if (!_.isFunction(methods)) throw Error('Argument `defaults` validate error, controller method must be an Array or a Function');
        }
      });
    }
  }
}, {
  name: 'opts',
  type: Object,
  allowNull: true,
  defaultValue: {}
}]);
