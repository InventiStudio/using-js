function using(data, async = false) {
  return {

    // Return actual value
    value() {
      return data
    },

    // Call function and return new instance of wrapper (no mutations)
    do(func) {
      return async && data instanceof Promise
        ? using(data.then(func), async)
        : using(func(data), async)
    },

    // Call function if condition is truthly (functions allowed)
    // otherwise return current wrapper
    doIf(condition, func) {
      if(typeof condition === 'function') {
        return condition(data) ? this.do(func) : this
      } else {
        return condition ? this.do(func) : this
      }
    },

    // Call function if condition is falsy (functions allowed)
    // otherwise return current wrapper
    doUnless(condition, func) {
      if(typeof condition === 'function') {
        return this.doIf((data) => !condition(data), func)
      } else {
        return this.doIf(!condition, func)
      }
    },

    // Call funcTruthy if condition is truthly (functions allowed)
    // Call funcFalsy  if condition is falsy (functions allowed)
    doIfElse(condition, funcTruthy, funcFalsy) {
      if(typeof condition === 'function') {
        return condition(data) ? this.do(funcTruthy) : this.do(funcFalsy)
      } else {
        return condition ? this.do(funcTruthy) : this.do(funcFalsy)
      }
    },

    // Call only one passed functions (based on value)
    switch(value, map) {
      let key;
      if (typeof value === 'function') {
        key = value(data)
      } else if (typeof value === 'object') {
        key = data
        map = value
      } else {
        key = value
      }
      if(map[key]) {
        return this.do(map[key])
      } else if (map['default']) {
        return this.do(map['default'])
      } else {
        return this
      }
    },

    // Call function without mutating data
    debug(logFunction) {
      logFunction(data)
      return this
    },
  }
}

using.async = function (data) { return using(data, true) }

module.exports = using
