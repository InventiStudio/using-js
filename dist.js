'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function using(data, async) {
  return {
    value: function value() {
      return data;
    },
    do: function _do(func) {
      return async && data instanceof Promise ? using(data.then(func), async) : using(func(data), async);
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
      } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
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
