var delegate  = require('func-delegate')
  , restify   = require('restify')
  , _         = require('underscore')
  , Router    = require('./lib/router');

var DEFAULT_METHODS = ['add', 'list', 'detail', 'remove', 'modify'];

var Server = restify.createServer().constructor;

var controllerChecker = function(ctl, type, names) {
  var pre = 'Argument `' + type + '` validate error';
  if (!_.isObject(ctl)) throw Error(pre + ', controller must be a object');
  message = pre + ', controller method must be an Array or a Function';
  var typeError = Error(message);
  var nameError = Error(pre + ', controller name must be a string');
  var nameNotAllowError = names && Error(type + ' only need ' + names.join(', '));
  _.each(ctl, function(methods, name) {
    if (!_.isString(name)) throw nameError;
    if (names && names.indexOf(name) === -1) throw nameNotAllowError;
    if (!_.isArray(methods) && !_.isFunction(methods)) throw typeError;
    if (_.isFunction(methods)) return;
    _.each(methods, function(method) {
      // logic or
      if (!_.isArray(method) && !_.isFunction(method)) throw typeError;
      if (_.isFunction(method)) return;
      _.each(method, function(_or) {
        if (!_.isFunction(_or)) throw typeError;
      });
    });
  });
};

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
        if (!_.isString(key)) {
          throw Error('Argument `ctls` must be a hash, key is string ' + key);
        }
        controllerChecker(ctl, 'ctls');
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
      controllerChecker(value, 'defaults', DEFAULT_METHODS);
      return true;
    }
  }
}, {
  name: 'opts',
  type: Object,
  allowNull: true,
  defaultValue: {}
}]);
