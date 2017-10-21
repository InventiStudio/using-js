module.exports = function using(data) {
  return {

    // Return actual value
    value() {
      return data
    },

    // Call function and return new instance of wrapper (no mutations)
    do(func) {
      return using(func(data))
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
    }
  }
}
