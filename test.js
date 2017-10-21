const chai   = require('chai')
const using  = require('./index')
const expect = chai.expect

const types = [
  'hello',
  1,
  [],
  {},
  () => {},
  /.*/g,
  null,
  undefined,
  NaN,
  true,
  false,
]

describe('using', () => {
  it('wraps all data types and returns proper value', () => {
    types.forEach((t) => {
      expect(using(t).do).to.be.a('function')
      expect(using(t).doIf).to.be.a('function')
      expect(using(t).doUnless).to.be.a('function')
      expect(using(t).switch).to.be.a('function')
      expect(using(t).value()).to.deep.equal(t)
    })
  })
})

describe('do', () => {
  it('invokes function with data passed', () => {
    types.forEach((t) => {
      const action = value => {
        expect(value).to.deep.equal(t)
        return value
      }
      const value = using(t).do(action).value()
      expect(value).to.deep.equal(t)
    })
  })
})

describe('doIf', () => {
  it('invokes function with data passed if value is truthy', () => {
    [
      { condition: true,  shouldInvoke: true  },
      { condition: false, shouldInvoke: false },
      { condition: 'val', shouldInvoke: true  },
      { condition: null,  shouldInvoke: false },
      { condition: 0,     shouldInvoke: false },
      { condition: {},    shouldInvoke: true  },
    ].forEach(testCase => {
      types.forEach(t => {
        let haveBeenCalled = false
        const action = value => {
          haveBeenCalled = true
          expect(value).to.deep.equal(t)
          return typeof value
        }
        const value = using(t).doIf(testCase.condition, action).value()
        const expectedValue = testCase.shouldInvoke ? typeof t : t
        expect(haveBeenCalled).to.equal(testCase.shouldInvoke)
        expect(value).to.deep.equal(expectedValue)
      })
    })
  })

  it('invokes function with data passed if returned value is truthy', () => {
    [
      { condition: () => true,  shouldInvoke: true  },
      { condition: () => false, shouldInvoke: false },
      { condition: () => 'val', shouldInvoke: true  },
      { condition: () => null,  shouldInvoke: false },
      { condition: () => 0,     shouldInvoke: false },
      { condition: () => ({}),  shouldInvoke: true  },
    ].forEach(testCase => {
      types.forEach(t => {
        let haveBeenCalled = false
        const action = value => {
          haveBeenCalled = true
          expect(value).to.deep.equal(t)
          return typeof value
        }
        const value = using(t).doIf(testCase.condition, action).value()
        const expectedValue = testCase.shouldInvoke ? typeof t : t
        expect(haveBeenCalled).to.equal(testCase.shouldInvoke)
        expect(value).to.deep.equal(expectedValue)
      })
    })
  })
})

describe('doUnless', () => {
  it('invokes function with data passed if value is truthy', () => {
    [
      { condition: () => true,  shouldInvoke: false },
      { condition: () => false, shouldInvoke: true  },
      { condition: () => 'val', shouldInvoke: false },
      { condition: () => null,  shouldInvoke: true  },
      { condition: () => 0,     shouldInvoke: true  },
      { condition: () => ({}),  shouldInvoke: false },
    ].forEach(testCase => {
      types.forEach(t => {
        let haveBeenCalled = false
        const action = value => {
          haveBeenCalled = true
          expect(value).to.deep.equal(t)
          return typeof value
        }
        const value = using(t).doUnless(testCase.condition, action).value()
        const expectedValue = testCase.shouldInvoke ? typeof t : t
        expect(haveBeenCalled).to.equal(testCase.shouldInvoke)
        expect(value).to.deep.equal(expectedValue)
      })
    })
  })

  it('invokes function with data passed if returned value is truthy', () => {
    [
      { condition: true,  shouldInvoke: false },
      { condition: false, shouldInvoke: true  },
      { condition: 'val', shouldInvoke: false },
      { condition: null,  shouldInvoke: true  },
      { condition: 0,     shouldInvoke: true  },
      { condition: {},    shouldInvoke: false },
    ].forEach(testCase => {
      types.forEach(t => {
        let haveBeenCalled = false
        const action = value => {
          haveBeenCalled = true
          expect(value).to.deep.equal(t)
          return typeof value
        }
        const value = using(t).doUnless(testCase.condition, action).value()
        const expectedValue = testCase.shouldInvoke ? typeof t : t
        expect(haveBeenCalled).to.equal(testCase.shouldInvoke)
        expect(value).to.deep.equal(expectedValue)
      })
    })
  })
})

describe('switch', () => {
  it('invokes function based on passed value', () => {
    types.forEach((t) => {
      ['a', 'b', 'c', 'd'].forEach(testCase => {
        let called  = undefined
        const value = using(t).switch(testCase, {
          a(value) {
            called = 'a'
            expect(value).to.deep.equal(t)
            return typeof value
          },
          b(value) {
            called = 'b'
            expect(value).to.deep.equal(t)
            return typeof value
          },
          default(value) {
            called = 'default'
            expect(value).to.deep.equal(t)
            return typeof value
          },
        }).value()
        if (testCase === 'a' || testCase === 'b') {
          expect(called).to.deep.equal(testCase)
        } else {
          expect(called).to.deep.equal('default')
        }
        expect(value).to.deep.equal(typeof t)
      })
    })
  })

  it('invokes function based on value', () => {
    const result = using('someKey')
      .switch({
        someKey() {
          return 'called'
        }
      })
      .value()
    expect(result).to.deep.equal('called')
  });

  it('invokes function based on function value', () => {
    const result = using('someKey')
      .switch(value => `x${value}x`, {
        xsomeKeyx() {
          return 'called'
        }
      })
      .value()
    expect(result).to.deep.equal('called')
  });
})
