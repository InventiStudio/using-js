'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function using(data) {
  var async = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  return {
    value: function value() {
      return data;
    },
    do: function _do(func) {
      return async && data instanceof _promise2.default ? using(data.then(func), async) : using(func(data), async);
    },
    doIf: function doIf(condition, func) {
      if (typeof condition === 'function') {
        return condition(data) ? this.do(func) : this;
      } else {
        return condition ? this.do(func) : this;
      }
    },
    doUnless: function doUnless(condition, func) {
      if (typeof condition === 'function') {
        return this.doIf(function (data) {
          return !condition(data);
        }, func);
      } else {
        return this.doIf(!condition, func);
      }
    },
    doIfElse: function doIfElse(condition, funcTruthy, funcFalsy) {
      if (typeof condition === 'function') {
        return condition(data) ? this.do(funcTruthy) : this.do(funcFalsy);
      } else {
        return condition ? this.do(funcTruthy) : this.do(funcFalsy);
      }
    },
    switch: function _switch(value, map) {
      var key = void 0;
      if (typeof value === 'function') {
        key = value(data);
      } else if ((typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'object') {
        key = data;
        map = value;
      } else {
        key = value;
      }
      if (map[key]) {
        return this.do(map[key]);
      } else if (map['default']) {
        return this.do(map['default']);
      } else {
        return this;
      }
    },
    debug: function debug(logFunction) {
      logFunction(data);
      return this;
    }
  };
}

using.async = function (data) {
  return using(data, true);
};

module.exports = using;
