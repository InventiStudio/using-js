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
      const key = typeof value === 'function' ? value(data) : value
      if(map[value]) {
        return this.do(map[value])
      } else if (map['default']) {
        return this.do(map['default'])
      } else {
        return this
      }
    }
  }
}
